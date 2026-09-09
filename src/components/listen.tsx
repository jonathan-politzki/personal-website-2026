'use client';

import { useRef, useState } from 'react';

/** A quiet pill under the byline that unfolds into the audio player on click. */
export function Listen({ slug, minutes, partial }: {
  slug: string;
  minutes: number;
  partial?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (!expanded) setExpanded(true);
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }

  return (
    <div className="listen" data-expanded={expanded}>
      <button
        type="button"
        className="listen-btn"
        onClick={toggle}
        aria-label={`Listen to ${partial ? 'the first part of ' : ''}this essay`}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          {playing ? (
            <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
          ) : (
            <path d="M4 2.5v11l10-5.5z" />
          )}
        </svg>
        <span>
          {partial ? 'Listen to part one' : 'Listen'} · {minutes} min
        </span>
      </button>
      <audio
        ref={audio}
        controls
        preload="none"
        src={`/audio/${slug}.mp3`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
