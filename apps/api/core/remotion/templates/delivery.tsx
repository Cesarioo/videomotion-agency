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

const Checkbox: React.FC<{ checked: boolean; scale: number }> = ({ checked, scale }) => (
  <div
    style={{
      width: 24,
      height: 24,
      borderRadius: 6,
      border: `2px solid ${checked ? ACCENT : BORDER}`,
      backgroundColor: checked ? ACCENT : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`,
      transition: 'background-color 0.1s, border-color 0.1s',
    }}
  >
    {checked && (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12l5 5L20 7"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
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

  // Checkbox click timings for each folder
  const checkbox1Click = 300;
  const checkbox2Click = 330;
  const checkbox3Click = 360;

  // Checkbox states (checked after click frame)
  const checkbox1Checked = frame >= checkbox1Click + 5;
  const checkbox2Checked = frame >= checkbox2Click + 5;
  const checkbox3Checked = frame >= checkbox3Click + 5;

  // Checkbox click animations (scale down then up)
  const checkbox1Scale = interpolate(frame, [checkbox1Click, checkbox1Click + 5, checkbox1Click + 10], [1, 0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const checkbox2Scale = interpolate(frame, [checkbox2Click, checkbox2Click + 5, checkbox2Click + 10], [1, 0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const checkbox3Scale = interpolate(frame, [checkbox3Click, checkbox3Click + 5, checkbox3Click + 10], [1, 0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Attachment appear animations
  const attachment1In = spring({ frame: frame - checkbox1Click - 8, fps, config: { damping: 12, stiffness: 200 } });
  const attachment2In = spring({ frame: frame - checkbox2Click - 8, fps, config: { damping: 12, stiffness: 200 } });
  const attachment3In = spring({ frame: frame - checkbox3Click - 8, fps, config: { damping: 12, stiffness: 200 } });

  // Panel is centered at (260, 160) in composition space (1920x1080)
  const panelOffsetX = 270;
  const panelOffsetY = 110;

  // Checkbox positions in panel space (left panel checkboxes)
  const checkboxPositions = [
    { x: 58, y: 178 },  // Reports checkbox
    { x: 58, y: 265 },  // Designs checkbox
    { x: 58, y: 360 },  // Copy checkbox
  ];

  // Email typing timing
  const typingStart = 390;
  const typingEnd = 425;
  const emailText = 'Here are all the deliveries.';
  const typingProgress = interpolate(frame, [typingStart, typingEnd], [0, emailText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const typed = emailText.slice(0, Math.round(typingProgress));

  // Finale animation - dim everything and bring send button forward
  const finaleStart = 440;
  const finaleDim = interpolate(frame, [finaleStart, finaleStart + 15], [1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Send button grows and moves to center
  const sendGrowProgress = interpolate(frame, [finaleStart, finaleStart + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Click happens after button is centered
  const sendClickStart = finaleStart + 25;
  const sendClick = interpolate(frame, [sendClickStart, sendClickStart + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sendClickScale = interpolate(sendClick, [0, 0.5, 1], [1, 0.85, 1]);

  // Final send button scale (starts normal, grows to 3x)
  const sendFinalScale = interpolate(sendGrowProgress, [0, 1], [1, 3]) * sendClickScale;

  // Zoom out after click - everything scales down revealing white background
  const zoomOutStart = sendClickStart + 6;
  const zoomOutEnd = zoomOutStart + 10;
  const zoomOutProgress = interpolate(frame, [zoomOutStart, zoomOutEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const zoomOutScale = interpolate(zoomOutProgress, [0, 1], [1, 0.05]);
  const zoomOutOpacity = interpolate(zoomOutProgress, [0.4, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Email body position for typing (right panel)
  const emailBodyX = 1100;
  const emailBodyY = 300;
  // Center of screen for finale
  const centerX = 960;
  const centerY = 540;

  const cursorX = interpolate(
    frame,
    [20, 70, 85, 110, 140, 230, 280, checkbox1Click, 315, checkbox2Click, 345, checkbox3Click, 380, typingStart, 430, finaleStart, finaleStart + 20],
    [860, 860, 1080, 980, 1080, 1080,
     checkboxPositions[0].x + panelOffsetX, checkboxPositions[0].x + panelOffsetX,
     checkboxPositions[1].x + panelOffsetX, checkboxPositions[1].x + panelOffsetX,
     checkboxPositions[2].x + panelOffsetX, checkboxPositions[2].x + panelOffsetX,
     emailBodyX, emailBodyX, emailBodyX, centerX, centerX],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );
  const cursorY = interpolate(
    frame,
    [20, 70, 85, 110, 140, 230, 280, checkbox1Click, 315, checkbox2Click, 345, checkbox3Click, 380, typingStart, 430, finaleStart, finaleStart + 20],
    [620, 620, 700, 560, 120, 120,
     checkboxPositions[0].y + panelOffsetY, checkboxPositions[0].y + panelOffsetY,
     checkboxPositions[1].y + panelOffsetY, checkboxPositions[1].y + panelOffsetY,
     checkboxPositions[2].y + panelOffsetY, checkboxPositions[2].y + panelOffsetY,
     emailBodyY, emailBodyY, emailBodyY, centerY, centerY],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Cursor scales up during finale
  const cursorScale = interpolate(frame, [finaleStart, finaleStart + 20], [1, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Folder data for rendering
  const folders = [
    { label: 'Reports', color: ACCENT, checked: checkbox1Checked, scale: checkbox1Scale, attachIn: attachment1In },
    { label: 'Designs', color: '#60a5fa', checked: checkbox2Checked, scale: checkbox2Scale, attachIn: attachment2In },
    { label: 'Copy', color: '#60a5fa', checked: checkbox3Checked, scale: checkbox3Scale, attachIn: attachment3In },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#2c3e50' }}>
      {/* Zoom out container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoomOutScale})`,
          opacity: zoomOutOpacity,
          transformOrigin: 'center center',
        }}
      >
        {/* Purple background */}
        <AbsoluteFill style={{ backgroundColor: BG }} />

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
            opacity: panelOpacity * finaleDim,
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

          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflow: 'hidden' }}>
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
                gap: 14,
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {/* Date separator - Last Friday */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.3 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: MUTED, fontWeight: 600 }}>
                  Last Friday
                </div>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
              </div>

              {/* Message history - Last Friday */}
              <div style={{ display: 'flex', gap: 12, opacity: 0.3 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_CLIENT} alt="ChocoMotion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>ChocoMotion · 3:42 PM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Hey team, project kickoff is next week!
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, opacity: 0.3 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_YOU} alt="Oscar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>Oscar · 4:15 PM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Sounds good, I'll prepare the content outline
                  </div>
                </div>
              </div>

              {/* Date separator - Yesterday */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.35 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: MUTED, fontWeight: 600 }}>
                  Yesterday
                </div>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
              </div>

              {/* Message history - Yesterday */}
              <div style={{ display: 'flex', gap: 12, opacity: 0.35 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_CLIENT} alt="ChocoMotion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>ChocoMotion · 10:30 AM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    How's the progress on the articles?
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, opacity: 0.35 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_YOU} alt="Oscar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>Oscar · 11:02 AM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Going well! 3 out of 5 done already
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, opacity: 0.35 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_CLIENT} alt="ChocoMotion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>ChocoMotion · 11:05 AM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Great work! Let me know when they're ready
                  </div>
                </div>
              </div>

              {/* Date separator - Today */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.5 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: MUTED, fontWeight: 600 }}>
                  Today
                </div>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
              </div>

              {/* Message history - Today (earlier) */}
              <div style={{ display: 'flex', gap: 12, opacity: 0.45 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_CLIENT} alt="ChocoMotion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>ChocoMotion · 9:15 AM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Can you send the blog articles by EOD?
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, opacity: 0.5 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_YOU} alt="Oscar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>Oscar · 9:22 AM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Sure! Just finishing up the last one now
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, opacity: 0.55 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, overflow: 'hidden' }}>
                  <img src={SLACK_AVATAR_CLIENT} alt="ChocoMotion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: MUTED }}>ChocoMotion · 9:24 AM</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, color: HEADER }}>
                    Perfect, thanks! 👍
                  </div>
                </div>
              </div>

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
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 22, color: HEADER }}>
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
              {folders.map((folder) => (
                <div
                  key={folder.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 18px',
                    borderRadius: 16,
                    backgroundColor: folder.checked ? '#f0fdf4' : '#f8fafc',
                    border: `1px solid ${folder.checked ? ACCENT : BORDER}`,
                  }}
                >
                  <Checkbox checked={folder.checked} scale={folder.scale} />
                  <FolderIcon size={38} color={folder.color} />
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 20, color: HEADER }}>{folder.label}</div>
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
                  minHeight: 140,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 20,
                  color: HEADER,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {typed}
              </div>

              {/* Attachments section */}
              {(checkbox1Checked || checkbox2Checked || checkbox3Checked) && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderTop: `1px solid ${BORDER}`,
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: MUTED, marginBottom: 10 }}>
                    Attachments
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {folders.map((folder) => (
                      folder.checked && (
                        <div
                          key={folder.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 14px',
                            borderRadius: 10,
                            backgroundColor: '#ffffff',
                            border: `1px solid ${BORDER}`,
                            transform: `scale(${interpolate(folder.attachIn, [0, 1], [0.8, 1])})`,
                            opacity: folder.attachIn,
                          }}
                        >
                          <FolderIcon size={20} color={folder.color} />
                          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: HEADER }}>
                            {folder.label}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

        {/* Send Button - moves from panel to center during finale */}
        <div
          style={{
            position: 'absolute',
            left: interpolate(sendGrowProgress, [0, 1], [1580, 960]),
            top: interpolate(sendGrowProgress, [0, 1], [866, 540]),
            transform: `translate(-50%, -50%) scale(${sendFinalScale})`,
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
            boxShadow: `0 ${interpolate(sendGrowProgress, [0, 1], [10, 30])}px ${interpolate(sendGrowProgress, [0, 1], [20, 60])}px rgba(239, 68, 68, ${interpolate(sendGrowProgress, [0, 1], [0.35, 0.6])})`,
            zIndex: 10,
            opacity: emailIn,
          }}
        >
          Send
        </div>

        <Cursor x={cursorX} y={cursorY} scale={cursorScale} />
      </div>
    </AbsoluteFill>
  );
};
