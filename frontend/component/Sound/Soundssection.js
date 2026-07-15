"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_ARTWORK = "/models/musicimg.jpg";

const BUILT_IN_AUDIO_FILES = [
  "Dvizhenie_za_nezavisimost_Indii_-_indian_national_conress_malayalam_song_(mp3.pm).mp3",
  "Neizvesten_-_SADDAM_HUSSEIN_MALAYALAM_SONG_(mp3.pm).mp3",
  "Raksha_Racha_2012_-_Singara_Kurvi_malayalam_song_(mp3.pm).mp3",
];

const STARTER_COLLECTIONS = [
  {
    id: "collection-1",
    title: "Sound Direction Notes",
    subtitle: "Creative references and imported stems",
    accent: "rgba(123, 92, 255, 0.35)",
  },
  {
    id: "collection-2",
    title: "Mix Sessions",
    subtitle: "Select a track to audition in the player",
    accent: "rgba(50, 215, 75, 0.22)",
  },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function deriveTrackMeta(file, index) {
  const extensionIndex = file.name.lastIndexOf(".");
  const rawName =
    extensionIndex > 0 ? file.name.slice(0, extensionIndex) : file.name;
  const [artistPart, titlePart] = rawName.split(" - ");
  const title = titlePart || artistPart || `Imported Track ${index + 1}`;
  const artist = titlePart ? artistPart : "Local Upload";

  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    title,
    artist,
    album: "Imported Session",
    cover: DEFAULT_ARTWORK,
    src: URL.createObjectURL(file),
    addedOn: new Date(file.lastModified || Date.now()),
    plays: 0,
    duration: 0,
    sizeLabel: `${Math.max(1, Math.round(file.size / 1024 / 1024))} MB`,
  };
}

function prettifyTrackLabel(value) {
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/\(mp3\.pm\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveBundledTrackMeta(fileName, index) {
  const normalizedName = prettifyTrackLabel(fileName);
  const [artistPart, titlePart] = normalizedName.split(" - ");
  const title = titlePart || artistPart || `Track ${index + 1}`;
  const artist = titlePart ? artistPart : "Sound Library";

  return {
    id: `bundled-track-${index}`,
    title,
    artist,
    album: "Featured Audio",
    cover: DEFAULT_ARTWORK,
    src: `/Audio/${encodeURIComponent(fileName)}`,
    addedOn: new Date(Date.UTC(2026, 4, index + 1)),
    plays: 0,
    duration: 0,
    sizeLabel: "Bundled Audio",
  };
}

const BUILT_IN_TRACKS = BUILT_IN_AUDIO_FILES.map(deriveBundledTrackMeta);

function IconButton({
  label,
  onClick,
  children,
  isPrimary = false,
  className = "",
}) {
  return (
    <button
      type="button"
      className={`sound-icon-button${isPrimary ? " sound-icon-button-primary" : ""}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function Soundssection() {
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]);

  const [tracks, setTracks] = useState(BUILT_IN_TRACKS);
  const [currentTrackId, setCurrentTrackId] = useState(
    BUILT_IN_TRACKS[0]?.id ?? null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentIndex = useMemo(
    () => tracks.findIndex((track) => track.id === currentTrackId),
    [tracks, currentTrackId]
  );

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] : null;
  const currentTrackSource = currentTrack?.src ?? null;

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const syncDuration = () => {
      setDuration(audio.duration || 0);

      setTracks((previousTracks) =>
        previousTracks.map((track) =>
          track.id === currentTrackId
            ? { ...track, duration: audio.duration || track.duration }
            : track
        )
      );
    };

    const handleEnded = () => {
      if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
        const nextTrack = tracks[currentIndex + 1];
        setCurrentTrackId(nextTrack.id);
        setTracks((previousTracks) =>
          previousTracks.map((track) =>
            track.id === nextTrack.id
              ? { ...track, plays: track.plays + 1 }
              : track
          )
        );
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, currentTrackId, tracks]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!currentTrackSource) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    audio.pause();
    audio.src = currentTrackSource;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackSource]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrackSource) {
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [isPlaying, currentTrackSource]);

  const openImporter = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event) => {
    const selectedFiles = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("audio/")
    );

    if (!selectedFiles.length) {
      return;
    }

    const importedTracks = selectedFiles.map((file, index) =>
      deriveTrackMeta(file, index)
    );

    objectUrlsRef.current.push(...importedTracks.map((track) => track.src));

    setTracks((previousTracks) => [...previousTracks, ...importedTracks]);

    if (!currentTrackId) {
      setCurrentTrackId(importedTracks[0].id);
    }

    event.target.value = "";
  };

  const selectTrack = (trackId, shouldPlay = true) => {
    setCurrentTrackId(trackId);

    if (shouldPlay) {
      setTracks((previousTracks) =>
        previousTracks.map((track) =>
          track.id === trackId ? { ...track, plays: track.plays + 1 } : track
        )
      );
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!tracks.length) {
      openImporter();
      return;
    }

    if (!currentTrack) {
      selectTrack(tracks[0].id, true);
      return;
    }

    setIsPlaying((previous) => !previous);
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      selectTrack(tracks[currentIndex - 1].id, true);
    }
  };

  const playNext = () => {
    if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
      selectTrack(tracks[currentIndex + 1].id, true);
    }
  };

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value);
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  return (
    <>
      <section className="sound-stage">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleImport}
          hidden
        />
        <audio ref={audioRef} preload="metadata" />

        <div className="sound-shell">
          <aside className="sound-library-panel">
            <div className="sound-library-head">
              <div>
                <p className="sound-panel-label">Your Library</p>
                <h2>Imported Tracks</h2>
              </div>

           
            </div>




            <div className="sound-collection-list">
              {tracks.length ? (
                tracks.map((track, index) => {
                  const isActive = track.id === currentTrackId;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      className={`sound-library-item${isActive ? " sound-library-item-active" : ""}`}
                      onClick={() => selectTrack(track.id, true)}
                    >
                      <img src={track.cover} alt="" />
                      <div>
                        <strong>{track.title}</strong>
                        <span>{track.artist}</span>
                      </div>
                      <small>{index + 1}</small>
                    </button>
                  );
                })
              ) : (
                STARTER_COLLECTIONS.map((collection) => (
                  <div
                    key={collection.id}
                    className="sound-library-placeholder"
                    style={{ "--collection-accent": collection.accent }}
                  >
                    <strong>{collection.title}</strong>
                    <span>{collection.subtitle}</span>
                  </div>
                ))
              )}
            </div>
          </aside>

          <div className="sound-main-panel">
            <div className="sound-hero">
              <div className="sound-hero-cover-wrap">
                <img
                  className="sound-hero-cover"
                  src={currentTrack?.cover || DEFAULT_ARTWORK}
                  alt={currentTrack?.title || "Sound artwork"}
                />
              </div>

              <div className="sound-hero-copy">
                <p className="sound-hero-type">
                  {tracks.length ? "Imported Track" : "Music Workspace"}
                </p>
                <h1>
                  {currentTrack?.title || "Build a Sound Library That Actually Plays"}
                </h1>


                <p className="sound-hero-meta">
                  {currentTrack
                    ? `${currentTrack.artist} / ${currentTrack.album}`
                    : "Add local audio files, select a track, and control playback from the deck below."}
                </p>
              </div>
            </div>

            <div className="sound-control-strip">
              <div className="sound-control-cluster">
                <IconButton
                  label="Previous track"
                  onClick={playPrevious}
                  className="sound-icon-button-secondary"
                >
                  <span
                    aria-hidden="true"
                    className="sound-glyph sound-glyph-skip-prev"
                  />
                </IconButton>
                <IconButton
                  label={isPlaying ? "Pause track" : "Play track"}
                  onClick={togglePlayPause}
                  isPrimary
                >
                  <span
                    aria-hidden="true"
                    className={`sound-glyph ${isPlaying ? "sound-glyph-pause" : "sound-glyph-play"}`}
                  />
                </IconButton>
                <IconButton
                  label="Next track"
                  onClick={playNext}
                  className="sound-icon-button-secondary"
                >
                  <span
                    aria-hidden="true"
                    className="sound-glyph sound-glyph-skip-next"
                  />
                </IconButton>
              </div>

              <div className="sound-control-status">
                {currentTrack ? (
                  <>
                    <span className="sound-control-kicker">Now Playing</span>
                    <h6>{currentTrack.title}</h6>
                    <span className="sound-control-detail">
                      {currentTrack.artist} · {currentTrack.album}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="sound-control-kicker">Player Ready</span>
                    <strong>No Track Loaded</strong>
                    <span className="sound-control-detail">
                      Import songs to begin playback.
                    </span>
                  </>
                )}
              </div>

              <div
                className={`sound-activity-meter${isPlaying ? " sound-activity-meter-active" : ""}`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <span />
              </div>

            </div>

            <div className="sound-table-wrap">
              <div className="sound-table-head">
                <span>#</span>
                <span>Title</span>
                <span>Added</span>
                <span>Length</span>
              </div>

              <div className="sound-table-body">
                {tracks.length ? (
                  tracks.map((track, index) => {
                    const isActive = track.id === currentTrackId;

                    return (
                      <button
                        key={track.id}
                        type="button"
                        className={`sound-track-row${isActive ? " sound-track-row-active" : ""}`}
                        onClick={() => selectTrack(track.id, true)}
                      >
                        <span className="sound-track-index">{index + 1}</span>
                        <span className="sound-track-title-group">
                          <img src={track.cover} alt="" />
                          <span>
                            <span>{track.title}</span>
                            <small>{track.artist}</small>
                          </span>
                        </span>
                        <span className="sound-track-added">
                          {track.addedOn.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="sound-track-duration">
                          {formatTime(track.duration || 0)}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="sound-empty-state">
                    <strong>No music added yet.</strong>
                    <p>
                      Use the import button to add `.mp3`, `.wav`, `.m4a`, or other
                      audio files from your device.
                    </p>
                    <button type="button" onClick={openImporter}>
                      Select Audio Files
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>



      <div className="sound-player-dock">
        <div className="sound-player-track">
          <img
            src={currentTrack?.cover || DEFAULT_ARTWORK}
            alt={currentTrack?.title || "Track artwork"}
          />
          <div>
            <span className="strong">{currentTrack?.title || "No track selected"}</span>
            <span>{currentTrack?.artist || "Import audio to start playback"}</span>
          </div>
        </div>

        <div className="sound-player-center">
          <div className="sound-player-buttons sound-player-buttons-pill">
            <IconButton
              label="Previous track"
              onClick={playPrevious}
              className="sound-player-dock-button"
            >
              <span
                aria-hidden="true"
                className="sound-glyph sound-glyph-skip-prev"
              />
            </IconButton>
            <IconButton
              label={isPlaying ? "Pause track" : "Play track"}
              onClick={togglePlayPause}
              isPrimary
              className="sound-player-dock-button sound-player-dock-button-primary"
            >
              <span
                aria-hidden="true"
                className={`sound-glyph ${isPlaying ? "sound-glyph-pause" : "sound-glyph-play"}`}
              />
            </IconButton>
            <IconButton
              label="Next track"
              onClick={playNext}
              className="sound-player-dock-button"
            >
              <span
                aria-hidden="true"
                className="sound-glyph sound-glyph-skip-next"
              />
            </IconButton>
          </div>

          <div className="sound-progress-row">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              disabled={!currentTrack || !duration}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="sound-player-volume">
          <span
            className={`sound-volume-icon ${
              volume === 0
                ? "sound-volume-icon-muted"
                : volume < 0.5
                  ? "sound-volume-icon-low"
                  : "sound-volume-icon-high"
            }`}
            aria-hidden="true"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <style jsx>{`
        .sound-stage {
          background:
            radial-gradient(circle at top left, rgba(53, 214, 114, 0.12), transparent 22%),
            radial-gradient(circle at top right, rgba(88, 126, 255, 0.16), transparent 28%),
            linear-gradient(180deg, #050605 0%, #0c0e0d 100%);
          color: #f4f7f3;
          padding: 1rem 1rem 7.5rem;
        }

        .sound-shell {
          width: min(1800px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 420px minmax(0, 1fr);
          gap: 0.85rem;
        }

        .sound-library-panel,
        .sound-main-panel {
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(17, 19, 18, 0.92);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .sound-library-panel {
          padding: 1.5rem 1.25rem;
        }

        .sound-library-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .sound-panel-label {
          margin: 0;
          font-size: 0.95rem;
          color: rgba(228, 232, 228, 0.62);
        }

        .sound-library-head h2 {
          margin: 0.2rem 0 0;
          font-size: 2rem;
          letter-spacing: -0.04em;
        }

        .sound-empty-state button {
          border: none;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .sound-empty-state button:hover {
          transform: translateY(-1px);
        }

       



     


 

    
        .sound-collection-list {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .sound-library-item,
        .sound-library-placeholder {
          width: 100%;
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.03);
          color: inherit;
          text-align: left;
        }

        .sound-library-item {
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .sound-library-item:hover {
          transform: translateX(2px);
          background: rgba(255, 255, 255, 0.05);
        }

        .sound-library-item-active {
          border-color: rgba(50, 215, 75, 0.48);
          background: rgba(50, 215, 75, 0.1);
        }

        .sound-library-item img {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          object-fit: cover;
        }

        .sound-library-item strong,
        .sound-library-placeholder strong {
          display: block;
          font-size: 1rem;
        }

        .sound-library-item span,
        .sound-library-placeholder span {
          display: block;
          margin-top: 0.2rem;
          color: rgba(233, 238, 233, 0.62);
          font-size: 0.92rem;
        }

        .sound-library-item small {
          color: rgba(233, 238, 233, 0.4);
          font-size: 0.82rem;
        }

        .sound-library-placeholder {
          grid-template-columns: 1fr;
          background:
            linear-gradient(135deg, var(--collection-accent), rgba(255, 255, 255, 0.03));
        }

        .sound-hero {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          gap: 1.75rem;
          align-items: end;
          padding: 1.4rem;
          min-height: 320px;
          background:
            linear-gradient(180deg, rgba(144, 165, 166, 0.92), rgba(48, 68, 66, 0.92));
        }

        .sound-hero-cover-wrap {
          max-width: 290px;
        }

        .sound-hero-cover {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
        }

        .sound-hero-type {
          margintop: 1rem;
          font-size: 1.7rem;
          font-weight: 600;
        }

        .sound-hero-copy h1 {
          margin: 0;
          font-size: clamp(1.5rem, 2vw, 2rem);
          line-height: 1;
          letter-spacing: 0.01em;
        }

        .sound-hero-meta {
          margin: 1rem 0 0;
          max-width: 50rem;
          font-size: 1.2rem;
          color: rgba(246, 249, 246, 0.82);
        }

        .sound-control-strip {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 1.4rem;
          padding: 1.15rem 1.4rem;
          margin: 1rem 1.4rem 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 26px;
          background:
            linear-gradient(135deg, rgba(11, 20, 19, 0.98), rgba(18, 29, 27, 0.94)),
            radial-gradient(circle at top right, rgba(30, 215, 96, 0.16), transparent 40%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .sound-control-cluster,
        .sound-player-buttons {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .sound-control-cluster {
          padding: 0.55rem 0.7rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .sound-icon-button {
          min-width: 54px;
          height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          font-size: 1.15rem;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .sound-icon-button:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.09);
        }

        .sound-icon-button-primary {
          min-width: 68px;
          height: 68px;
          border: none;
          background: linear-gradient(135deg, #1ee35f, #43f17c);
          color: #07120a;
          font-size: 1.7rem;
          font-weight: 900;
          box-shadow:
            0 18px 36px rgba(30, 215, 96, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
        }

        .sound-icon-button-secondary {
          min-width: 48px;
          height: 48px;
          background: rgba(13, 21, 20, 0.92);
        }

        .sound-glyph {
          position: relative;
          display: inline-block;
          width: 18px;
          height: 18px;
        }

        .sound-glyph-play::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-38%, -50%);
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 16px solid currentColor;
        }

        .sound-glyph-pause::before,
        .sound-glyph-pause::after {
          content: "";
          position: absolute;
          top: 1px;
          bottom: 1px;
          width: 4px;
          border-radius: 999px;
          background: currentColor;
        }

        .sound-glyph-pause::before {
          left: 4px;
        }

        .sound-glyph-pause::after {
          right: 4px;
        }

        .sound-glyph-skip-prev::before,
        .sound-glyph-skip-prev::after,
        .sound-glyph-skip-next::before,
        .sound-glyph-skip-next::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 0;
          height: 0;
          transform: translateY(-50%);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }

        .sound-glyph-skip-prev::before {
          left: 3px;
          border-right: 8px solid currentColor;
        }

        .sound-glyph-skip-prev::after {
          left: 9px;
          border-right: 8px solid currentColor;
        }

        .sound-glyph-skip-next::before {
          right: 9px;
          border-left: 8px solid currentColor;
        }

        .sound-glyph-skip-next::after {
          right: 3px;
          border-left: 8px solid currentColor;
        }

        .sound-volume-icon {
          position: relative;
          width: 22px;
          height: 22px;
          display: inline-block;
          flex: 0 0 auto;
          color: rgba(244, 247, 243, 0.9);
        }

        .sound-volume-icon::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background: currentColor;
          transform: translateY(-50%);
        }

        .sound-volume-icon::after {
          content: "";
          position: absolute;
          left: 7px;
          top: 50%;
          width: 0;
          height: 0;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
          border-left: 10px solid currentColor;
          transform: translateY(-50%);
        }

        .sound-volume-icon-low,
        .sound-volume-icon-high,
        .sound-volume-icon-muted {
          overflow: visible;
        }

        .sound-volume-icon-low::before,
        .sound-volume-icon-high::before,
        .sound-volume-icon-muted::before,
        .sound-volume-icon-low::after,
        .sound-volume-icon-high::after,
        .sound-volume-icon-muted::after {
          z-index: 1;
        }

        .sound-volume-icon-low {
          background-image:
            radial-gradient(circle at 17px 11px, transparent 0 4px, currentColor 4.6px 5.6px, transparent 6.1px);
          background-repeat: no-repeat;
        }

        .sound-volume-icon-high {
          background-image:
            radial-gradient(circle at 17px 11px, transparent 0 4px, currentColor 4.6px 5.6px, transparent 6.1px),
            radial-gradient(circle at 17px 11px, transparent 0 8px, currentColor 8.6px 9.6px, transparent 10.1px);
          background-repeat: no-repeat;
        }

        .sound-volume-icon-muted::before,
        .sound-volume-icon-muted::after {
          opacity: 0.68;
        }

        .sound-volume-icon-muted {
          background:
            linear-gradient(
              45deg,
              transparent 41%,
              currentColor 41% 50%,
              transparent 50% 58%,
              currentColor 58% 67%,
              transparent 67%
            );
          background-repeat: no-repeat;
          background-position: 11px 2px;
          background-size: 12px 18px;
        }

        .sound-control-status {
          flex: 1 1 auto;
          min-width: 0;
        }

        .sound-control-status strong,
        .sound-control-status span {
          display: block;
        }

        .sound-control-status strong {
          margin-top: 0.12rem;
          font-size: clamp(1.25rem, 2vw, 1.7rem);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sound-control-kicker {
          color: #9ad5b0;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .sound-control-detail {
          margin-top: 0.35rem;
          color: rgba(232, 238, 233, 0.64);
          font-size: 0.98rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sound-activity-meter {
          align-self: stretch;
          display: grid;
          grid-template-columns: repeat(4, 8px);
          align-items: end;
          gap: 0.35rem;
          min-width: 54px;
          padding: 0.6rem 0.75rem;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .sound-activity-meter span {
          display: block;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(143, 240, 174, 0.95), rgba(35, 224, 109, 0.35));
          opacity: 0.45;
          transform-origin: bottom center;
          animation: sound-meter-idle 1.8s ease-in-out infinite;
        }

        .sound-activity-meter span:nth-child(1) {
          height: 16px;
        }

        .sound-activity-meter span:nth-child(2) {
          height: 28px;
          animation-delay: 0.15s;
        }

        .sound-activity-meter span:nth-child(3) {
          height: 20px;
          animation-delay: 0.3s;
        }

        .sound-activity-meter span:nth-child(4) {
          height: 32px;
          animation-delay: 0.45s;
        }

        .sound-activity-meter-active span {
          opacity: 1;
          animation-name: sound-meter-active;
        }

        .sound-table-wrap {
          padding: 0 1.4rem 1.4rem;
        }

        .sound-table-head,
        .sound-track-row {
          display: grid;
          grid-template-columns: 56px minmax(0, 1.8fr) minmax(140px, 0.7fr) 90px;
          gap: 1rem;
          align-items: center;
        }

        .sound-table-head {
          padding: 1rem 0;
          color: rgba(224, 230, 224, 0.52);
          font-size: 0.92rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sound-table-body {
          padding-top: 0.5rem;
        }

        .sound-track-row {
          width: 100%;
          padding: 1rem 0;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .sound-track-row:hover,
        .sound-track-row-active {
          background: rgba(255, 255, 255, 0.03);
        }

        .sound-track-index,
        .sound-track-added,
        .sound-track-duration {
          color: rgba(225, 231, 225, 0.72);
          font-size: 0.95rem;
        }

        .sound-track-title-group {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .sound-track-title-group img {
          width: 54px;
          height: 54px;
          border-radius: 10px;
          object-fit: cover;
          flex: 0 0 auto;
        }

        .sound-track-title-group strong,
        .sound-track-title-group small {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sound-track-title-group span {
          font-size: 1rem;
        }

        .sound-track-title-group small {
          margin-top: 0.25rem;
          color: rgba(224, 230, 224, 0.62);
        }

        .sound-empty-state {
          padding: 3rem 1rem;
          text-align: center;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.03);
        }

        .sound-empty-state strong {
          display: block;
          font-size: 1.3rem;
        }

        .sound-empty-state p {
          max-width: 38rem;
          margin: 0.85rem auto 0;
          color: rgba(228, 232, 228, 0.68);
          line-height: 1.6;
        }

        .sound-empty-state button {
          margin-top: 1.2rem;
          padding: 0.95rem 1.4rem;
          border-radius: 999px;
          background: #1ed760;
          color: #05110a;
          font-weight: 800;
        }

        .sound-player-dock {
          position: fixed;
          left: 50%;
          bottom: 1rem;
          transform: translateX(-50%);
          z-index: 40;
          display: grid;
          grid-template-columns: minmax(0, 300px) minmax(0, 1fr) minmax(220px, 280px);
          gap: 1rem;
          align-items: center;
          width: min(1120px, calc(100% - 1.5rem));
          padding: 0.8rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(10, 15, 14, 0.96), rgba(8, 12, 12, 0.92));
          box-shadow:
            0 22px 50px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(18px);
        }

        .sound-player-track {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .sound-player-track img {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          object-fit: cover;
        }

        .sound-player-track .strong,
        .sound-player-track span {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sound-player-track span {
          margin-top: 0.25rem;
          color: rgba(224, 230, 224, 0.62);
          font-size: 0.92rem;
        }
        .sound-player-track .strong {
          margin-top: 0.25rem;
          color: rgba(224, 230, 224, 0.62);
          font-size: 1.10rem;
          font-weight: 600;
        }

        .sound-player-center {
          min-width: 0;
        }

        .sound-player-buttons {
          justify-content: center;
        }

        .sound-player-buttons-pill {
          width: fit-content;
          margin: 0 auto;
          gap: 0.45rem;
          padding: 0.42rem 0.55rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 10px 24px rgba(0, 0, 0, 0.18);
        }

        .sound-player-dock-button {
          min-width: 42px;
          width: 42px;
          height: 42px;
          border: none;
          background: transparent;
          color: rgba(244, 247, 243, 0.92);
          box-shadow: none;
        }

        .sound-player-dock-button:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: transparent;
          box-shadow: none;
        }

        .sound-player-dock-button-primary {
          min-width: 52px;
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.97);
          color: #08100d;
          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.88);
        }

        .sound-player-dock-button-primary:hover {
          background: #ffffff;
        }

        .sound-progress-row {
          display: grid;
          grid-template-columns: 52px minmax(0, 1fr) 52px;
          gap: 0.8rem;
          align-items: center;
          margin-top: 0.7rem;
        }

        .sound-progress-row span,
        .sound-player-volume span {
          color: rgba(224, 230, 224, 0.7);
          font-size: 0.9rem;
        }

        input[type="range"] {
          width: 100%;
          accent-color: #ffffff;
          cursor: pointer;
        }

        @keyframes sound-meter-idle {
          0%,
          100% {
            transform: scaleY(0.55);
          }
          50% {
            transform: scaleY(0.82);
          }
        }

        @keyframes sound-meter-active {
          0%,
          100% {
            transform: scaleY(0.35);
          }
          45% {
            transform: scaleY(1);
          }
          75% {
            transform: scaleY(0.6);
          }
        }

        .sound-player-volume {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        @media (max-width: 1200px) {
          .sound-shell {
            grid-template-columns: 1fr;
          }

          .sound-hero {
            grid-template-columns: 220px minmax(0, 1fr);
          }
        }

        @media (max-width: 1000px) {
                 .sound-player-track .strong {
          font-size: 1rem;
          font-weight: 600;
        }
        
        
        
        .sound-stage {
            padding: 0.85rem 0.85rem 11rem;
          
          }

          .sound-shell {
            gap: 0.8rem;
          }

          .sound-main-panel {
            order: 1;
            border: none;
            border-radius: 0;
            background: linear-gradient(180deg, rgba(40, 35, 21, 0.2), rgba(10, 10, 10, 0.92) 46%);
            box-shadow: none;
          }

          .sound-library-panel {
            display: none;
          }

          .sound-library-head {
            display: none;
          }

          .sound-hero {
            grid-template-columns: 1fr;
            justify-items: center;
            align-items: start;
            gap: 1rem;
            padding: 0.35rem 0.15rem 0.5rem;
            min-height: auto;
            background: transparent;
          }

          .sound-hero-cover-wrap {
            width: min(100%, 230px);
            max-width: 230px;
          }

          .sound-hero-cover {
            border-radius: 6px;
            box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
          }

          .sound-hero-copy {
            width: 100%;
            max-width: 100%;
          }

          .sound-hero-type {
            display: none;
          }

          .sound-hero-copy h1 {
            margin-top: 0.15rem;
            font-size: clamp(1.28rem, 3.2vw, 1.95rem);
            line-height: 1.12;
            letter-spacing: -0.04em;
          }

          .sound-hero-meta {
            margin-top: 0.55rem;
            font-size: 0.92rem;
            color: rgba(235, 236, 229, 0.72);
          }

          .sound-control-strip {
            grid-template-columns: 1fr;
            justify-items: start;
            gap: 0.8rem;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
          }

          .sound-control-cluster {
            width: 100%;
            justify-content: space-between;
            padding: 0.1rem 0;
            background: transparent;
            border: none;
          }

          .sound-icon-button {
            min-width: 42px;
            width: 42px;
            height: 42px;
            background: rgba(255, 255, 255, 0.04);
          }

          .sound-icon-button-primary {
            min-width: 56px;
            width: 56px;
            height: 56px;
            background: #1ed760;
            box-shadow: 0 12px 24px rgba(30, 215, 96, 0.25);
          }

          .sound-icon-button-secondary {
            background: transparent;
            border-color: rgba(255, 255, 255, 0.12);
          }

          .sound-control-status {
            width: 100%;
          }

          .sound-control-status h6,
          .sound-control-status strong {
            margin: 0.2rem 0 0;
            font-size: 1.02rem;
          }

          .sound-control-detail {
            margin-top: 0.25rem;
            font-size: 0.9rem;
            white-space: normal;
          }

          .sound-activity-meter {
            display: none;
          }

          .sound-table-wrap {
            padding: 0.2rem 0 1rem;
          }

          .sound-table-head {
            display: none;
          }

          .sound-table-body {
            padding-top: 0;
            display: flex;
            flex-direction: column;
            gap: 0.45rem;
          }

          .sound-track-row {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 0.7rem;
            padding: 0.8rem 0.1rem;
            border: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 0;
            background: transparent;
          }

          .sound-track-row:hover,
          .sound-track-row-active {
            background: transparent;
            border-color: rgba(255, 255, 255, 0.1);
          }

          .sound-track-index,
          .sound-track-added {
            display: none;
          }

          .sound-track-title-group img {
            display: none;
          }

          .sound-track-duration {
            align-self: center;
            font-size: 0.78rem;
            color: rgba(225, 231, 225, 0.46);
          }

          .sound-player-dock {
            grid-template-columns: minmax(0, 1fr);
            gap: 0.65rem;
            bottom: 0.75rem;
            width: calc(100% - 1rem);
            padding: 0.7rem 0.8rem;
            border-radius: 14px;
          }

          .sound-player-track {
            order: 1;
            gap: 0.7rem;
          }

          .sound-player-center {
            order: 2;
          }

          .sound-player-volume {
            display: none;
          }

          .sound-player-buttons {
            justify-content: flex-start;
          }

          .sound-progress-row {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .sound-stage {
            padding-bottom: 10rem;
          }

          .sound-hero {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .sound-hero-cover-wrap {
            max-width: 220px;
          }

          .sound-control-strip {
            grid-template-columns: 1fr;
            align-items: stretch;
          }

          .sound-control-status strong,
          .sound-control-detail {
            white-space: normal;
          }

          .sound-activity-meter {
            display: none;
          }

          .sound-player-dock {
            bottom: 0.75rem;
            width: calc(100% - 1rem);
          }
        }

        @media (max-width: 640px) {
          .sound-stage {
            padding-left: 0.7rem;
            padding-right: 0.7rem;
          }

          .sound-library-panel,
          .sound-main-panel {
            border-radius: 0;
          }

          .sound-library-head {
            flex-direction: column;
            align-items: stretch;
          }

          .sound-library-head h2 {
            font-size: 1.7rem;
          }

     

          .sound-hero-meta {
            font-size: 0.88rem;
          }

          .sound-hero-cover-wrap {
            max-width: 210px;
          }

          .sound-control-cluster {
            gap: 0.45rem;
          }

          .sound-track-title-group span {
            font-size: 0.95rem;
          }

          .sound-track-title-group small {
            font-size: 0.82rem;
          }

          .sound-player-track img {
            width: 52px;
            height: 52px;
          }

          .sound-progress-row {
            grid-template-columns: 44px minmax(0, 1fr) 44px;
            gap: 0.55rem;
          }
        }
      `}</style>
    </>
  );
}

