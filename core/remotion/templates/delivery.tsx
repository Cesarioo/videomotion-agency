import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

const BG = '#8e44ad';
const PANEL = '#ffffff';
const BORDER = '#e2e8f0';
const HEADER = '#0f172a';
const MUTED = '#64748b';
const ACCENT = '#22c55e';
const RED = '#ef4444';
const SLACK_AVATAR_YOU =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ycG9yYXRlJTIwcGVvcGxlfGVufDB8fDB8fHww';
const SLACK_AVATAR_CLIENT =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29ycG9yYXRlJTIwcGVvcGxlfGVufDB8fDB8fHww';

const Cursor: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-6px, -4px) scale(${scale})`,
      pointerEvents: 'none',
      zIndex: 40,
    }}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 2l14 10-7 .6 4 7-2.2 1-3.8-7.8-4 4.2V2z"
        fill="#111827"
        stroke="#ffffff"
        strokeWidth="1"
      />
    </svg>
  </div>
);

const FolderIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M10 4l2 2h8a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h6z"
      fill={color}
    />
    <rect x="2" y="8" width="20" height="2" fill="#ffffff" opacity="0.2" />
  </svg>
);

export const DeliveryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 110 } });
  const panelScale = interpolate(panelIn, [0, 1], [0.96, 1]);
  const panelOpacity = interpolate(panelIn, [0, 1], [0, 1]);

  const slackIn = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 120 } });
  const slackScale = interpolate(slackIn, [0, 1], [0.95, 1]);

  const slackTextStart = 20;
  const slackTextEnd = 70;
  const slackText = 'Hello, we just wrote all blog articles! Sending them over :)';
  const slackProgress = interpolate(frame, [slackTextStart, slackTextEnd], [0, slackText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slackTyped = slackText.slice(0, Math.round(slackProgress));

  const slackSendStart = 80;
  const slackSendEnd = 90;
  const slackSent = frame >= slackSendEnd;
  const slackSendClick = interpolate(frame, [slackSendStart, slackSendEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const typingDotsStart = slackSendEnd + 50;
  const typingDotsEnd = typingDotsStart + 30;
  const typingDotsOpacity = interpolate(frame, [typingDotsStart, typingDotsEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const typingVisible = frame >= typingDotsStart;
  const typingDotPhase = Math.floor(((frame - typingDotsStart) / 8) % 3) + 1;
  const typingText = typingVisible ? `Typing${'.'.repeat(typingDotPhase)}` : '';
  const replyStart = typingDotsEnd + 10;
  const replyText = 'Ok, send them over.';

  const slackOutStart = 230;
  const slackOutEnd = 250;
  const slackOut = interpolate(frame, [slackOutStart, slackOutEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const emailInStart = 250;
  const emailInEnd = 270;
  const emailIn = interpolate(frame, [emailInStart, emailInEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const dragStart = 300;
  const dragPick = 320;
  const dragEnd = 360;

  const folderStart = { x: 360, y: 420 };
  const folderTarget = { x: 1040, y: 360 };

  const dragProgress = interpolate(frame, [dragPick, dragEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const folderX = interpolate(dragProgress, [0, 1], [folderStart.x, folderTarget.x]);
  const folderY = interpolate(dragProgress, [0, 1], [folderStart.y, folderTarget.y]);

  const cursorX = interpolate(
    frame,
    [20, 70, 85, 110, 140, 230, dragStart, dragPick, dragEnd, 385, 415],
    [860, 860, 1080, 980, 1080, 1080, 520, folderStart.x + 12, folderTarget.x + 40, 1040, 1120],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );
  const cursorY = interpolate(
    frame,
    [20, 70, 85, 110, 140, 230, dragStart, dragPick, dragEnd, 385, 415],
    [620, 620, 700, 560, 120, 120, 430, folderStart.y - 12, folderTarget.y - 20, 520, 560],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const typingStart = 370;
  const typingEnd = 405;
  const emailText = 'Here are all the deliveries.';
  const typingProgress = interpolate(frame, [typingStart, typingEnd], [0, emailText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const typed = emailText.slice(0, Math.round(typingProgress));

  const sendClick = interpolate(frame, [420, 435], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sendScale = interpolate(sendClick, [0, 0.5, 1], [1, 0.92, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1400,
          height: 760,
          backgroundColor: PANEL,
          borderRadius: 24,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
          transform: `translate(-50%, -50%) scale(${panelScale})`,
          opacity: panelOpacity,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
        }}
      >
        {/* Slack layout */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            opacity: slackOut,
            transform: `scale(${slackScale})`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: '#1f1d2b',
              color: '#f8fafc',
              padding: '26px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 700 }}>ChocoMotion</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: '#cbd5f5' }}>Channels</div>
            {['# general', '# planning', '# delivery', '# reviews'].map((label) => (
              <div key={label} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: '#e2e8f0' }}>
                {label}
              </div>
            ))}
            <div style={{ marginTop: 'auto', fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: '#94a3b8' }}>
              Integrations
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          <div
            style={{
              height: 64,
              borderBottom: `1px solid ${BORDER}`,
              padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 700, color: HEADER }}>
                # delivery
              </div>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  backgroundColor: ACCENT,
                  color: '#ffffff',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: '0 10px 20px rgba(34, 197, 94, 0.35)',
                  transform: `scale(${interpolate(frame, [140, 160], [1, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
                }}
              >
                Open Email
              </div>
            </div>

            <div
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: 18,
                flex: 1,
              }}
            >
              {slackSent && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    <img
                      src={SLACK_AVATAR_YOU}
                      alt="Oscar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: MUTED }}>Oscar · now</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 22, color: HEADER, minHeight: 52 }}>
                      {slackTyped}
                    </div>
                  </div>
                </div>
              )}

              {slackSent && typingVisible && frame < replyStart && (
                <div style={{ display: 'flex', gap: 12, opacity: typingDotsOpacity }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    <img
                      src={SLACK_AVATAR_CLIENT}
                      alt="ChocoMotion"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, color: HEADER }}>
                    {typingText}
                  </div>
                </div>
              )}

              {slackSent && frame >= replyStart && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    <img
                      src={SLACK_AVATAR_CLIENT}
                      alt="ChocoMotion"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: MUTED }}>ChocoMotion · now</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20, color: HEADER }}>
                      {replyText}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                padding: '16px 24px',
                borderTop: `1px solid ${BORDER}`,
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    border: `1px solid ${BORDER}`,
                    backgroundColor: '#ffffff',
                    padding: '12px 16px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: 16,
                    color: HEADER,
                    minHeight: 48,
                  }}
                >
                  {slackSent ? '' : slackTyped}
                </div>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: 12,
                    backgroundColor: HEADER,
                    color: '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    transform: `scale(${interpolate(slackSendClick, [0, 0.5, 1], [1, 0.92, 1])})`,
                  }}
                >
                  Send
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email layout */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            opacity: emailIn,
            transform: `scale(${0.96 + emailIn * 0.04})`,
            zIndex: 5,
          }}
        >
          <div style={{ padding: '40px 40px', borderRight: `1px solid ${BORDER}` }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 700, color: HEADER }}>
              Delivery Assets
            </div>
            <div style={{ marginTop: 30, display: 'grid', gap: 18 }}>
              {['Reports', 'Designs', 'Copy'].map((label, index) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 18px',
                    borderRadius: 16,
                    backgroundColor: '#f8fafc',
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <FolderIcon size={38} color={index === 0 ? ACCENT : '#60a5fa'} />
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20, color: HEADER }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '40px 40px', position: 'relative' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 700, color: HEADER }}>
              New Email
            </div>

            <div style={{ marginTop: 20, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: `1px solid ${BORDER}`,
                  color: MUTED,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 16,
                }}
              >
                To: client@company.com
              </div>
              <div
                style={{
                  padding: '18px',
                  minHeight: 220,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 20,
                  color: HEADER,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {typed}
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: 60,
                top: 80,
                width: 220,
                height: 120,
                borderRadius: 16,
                border: `2px dashed ${BORDER}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: MUTED,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 16,
                opacity: 0.7,
              }}
            >
              Drop files
            </div>

            <div
              style={{
                position: 'absolute',
                right: 60,
                bottom: 50,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 22px',
                backgroundColor: RED,
                color: '#ffffff',
                borderRadius: 999,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                transform: `scale(${sendScale})`,
                boxShadow: '0 10px 20px rgba(239, 68, 68, 0.35)',
              }}
            >
              Send
            </div>
          </div>
        </div>

        {/* Dragged folder */}
        <div
          style={{
            position: 'absolute',
            left: folderX,
            top: folderY,
            transform: `translate(-50%, -50%) scale(${interpolate(dragProgress, [0, 1], [1, 0.9])})`,
            opacity: frame < dragPick ? 0 : 1,
            zIndex: 20,
          }}
        >
          <FolderIcon size={64} color={ACCENT} />
        </div>
      </div>

      <Cursor x={cursorX} y={cursorY} />
    </AbsoluteFill>
  );
};
