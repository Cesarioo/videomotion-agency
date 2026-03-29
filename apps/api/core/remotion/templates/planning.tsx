import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

const BG = '#27ae60';
const PANEL = '#ffffff';
const BORDER = '#e2e8f0';
const HEADER = '#0f172a';
const MUTED = '#64748b';
const ACCENT = '#22c55e';

const Cursor: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({ x, y, scale = 1, opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-6px, -4px) scale(${scale})`,
      pointerEvents: 'none',
      zIndex: 30,
      opacity,
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

type TaskRow = {
  id: string;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  task: string;
  owner: string;
  due: string;
  avatarUrl: string;
  typed?: boolean;
};

const TASKS: TaskRow[] = [
  {
    id: 'task-1',
    statusLabel: 'New',
    statusColor: '#166534',
    statusBg: '#ecfdf5',
    task: 'create 50 blog articles',
    owner: 'Content Team',
    due: 'Feb 10',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ycG9yYXRlJTIwcGVvcGxlfGVufDB8fDB8fHww',
    typed: true,
  },
  {
    id: 'task-2',
    statusLabel: 'In Plan',
    statusColor: '#1d4ed8',
    statusBg: '#eff6ff',
    task: 'Modify DNS zoning',
    owner: 'Tech Ops',
    due: 'Feb 14',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29ycG9yYXRlJTIwcGVvcGxlfGVufDB8fDB8fHww',
    typed: true,
  },
  {
    id: 'task-3',
    statusLabel: 'Assigned',
    statusColor: '#7c2d12',
    statusBg: '#fff7ed',
    task: 'Finalize keyword map',
    owner: 'SEO Lead',
    due: 'Feb 18',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvcnBvcmF0ZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'task-4',
    statusLabel: 'Queued',
    statusColor: '#0f766e',
    statusBg: '#f0fdfa',
    task: 'Publish landing page',
    owner: 'Web Team',
    due: 'Feb 21',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvcnBvcmF0ZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'task-5',
    statusLabel: 'Review',
    statusColor: '#4338ca',
    statusBg: '#eef2ff',
    task: 'Approve design mockups',
    owner: 'Client',
    due: 'Feb 24',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvcnBvcmF0ZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'task-6',
    statusLabel: 'Blocked',
    statusColor: '#b91c1c',
    statusBg: '#fee2e2',
    task: 'Gather analytics access',
    owner: 'Client Ops',
    due: 'Feb 26',
    avatarUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvcnBvcmF0ZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'task-7',
    statusLabel: 'Delivery',
    statusColor: '#8e44ad',
    statusBg: '#f3e8ff',
    task: 'Onboarding kickoff call',
    owner: 'Account Team',
    due: 'Mar 1',
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNvcnBvcmF0ZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  },
];

const DELIVERED_COLOR = '#8e44ad';

// Timeline for zoom out animation
const ZOOM_START = 180;
const ZOOM_END = 220;

export const SecondPillarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const panelIn = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 110 } });
  const panelScale = interpolate(panelIn, [0, 1], [0.95, 1]);
  const panelOpacity = interpolate(panelIn, [0, 1], [0, 1]);

  // Zoom animation - focus on "Delivery" status badge (task-7, last row)
  const zoomProgress = interpolate(
    frame,
    [ZOOM_START, ZOOM_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  // Panel zooms into the Delivery badge position (bottom-left of panel, row 7)
  // Transform origin is set to where the Delivery badge is located
  const zoomScale = interpolate(zoomProgress, [0, 1], [1, 100]);
  const panelFadeOut = interpolate(zoomProgress, [0.6, 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Purple background fills the screen as we zoom into the badge
  const purpleBgOpacity = interpolate(zoomProgress, [0.4, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const task1Start = 30;
  const task2Start = 80;

  const task1Text = TASKS[0].task;
  const task2Text = TASKS[1].task;

  const task1Progress = interpolate(frame, [task1Start, task1Start + 28], [0, task1Text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const task2Progress = interpolate(frame, [task2Start, task2Start + 28], [0, task2Text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const task1Visible = Math.round(task1Progress);
  const task2Visible = Math.round(task2Progress);

  const row1Appear = spring({ frame: frame - task1Start, fps, config: { damping: 14, stiffness: 120 } });
  const row2Appear = spring({ frame: frame - task2Start, fps, config: { damping: 14, stiffness: 120 } });

  const cursorX = interpolate(frame, [task1Start - 10, task1Start + 28, task2Start - 10, task2Start + 28], [560, 790, 560, 760], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cursorY = interpolate(frame, [task1Start - 10, task1Start + 28, task2Start - 10, task2Start + 28], [380, 380, 450, 450], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Purple background that fills the screen as we zoom into the Delivery badge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: DELIVERED_COLOR,
          opacity: purpleBgOpacity,
          zIndex: 20,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1200,
          height: 700,
          backgroundColor: PANEL,
          borderRadius: 24,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
          transform: `translate(-50%, -50%) scale(${panelScale * zoomScale})`,
          opacity: panelOpacity * panelFadeOut,
          transformOrigin: '6% 93%', // Bottom-left where the Delivery badge is (last row, status column)
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 90,
            backgroundColor: '#f1f5f9',
            borderBottom: `1px solid ${BORDER}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 36px',
            gap: 18,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#ef4444' }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#f59e0b' }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#22c55e' }} />
          <div style={{ marginLeft: 18, fontFamily: 'Montserrat, sans-serif', fontSize: 24, color: HEADER, fontWeight: 700 }}>
            Planning Board
          </div>
        </div>

        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 220px 160px',
            padding: '18px 36px',
            borderBottom: `1px solid ${BORDER}`,
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 16,
            color: MUTED,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          <div>Status</div>
          <div>Task</div>
          <div>Owner</div>
          <div>Due</div>
        </div>

        {TASKS.map((task, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;
          const isFourth = index === 3;
          const isFifth = index === 4;
          const isSixth = index === 5;
          const isSeventh = index === 6;

          const appear =
            isFirst
              ? row1Appear
              : isSecond
                ? row2Appear
                : isThird
                  ? spring({ frame: frame - (task2Start + 26), fps, config: { damping: 14, stiffness: 120 } })
                  : isFourth
                    ? spring({ frame: frame - (task2Start + 42), fps, config: { damping: 14, stiffness: 120 } })
                    : isFifth
                      ? spring({ frame: frame - (task2Start + 58), fps, config: { damping: 14, stiffness: 120 } })
                      : isSixth
                        ? spring({ frame: frame - (task2Start + 74), fps, config: { damping: 14, stiffness: 120 } })
                        : isSeventh
                          ? spring({ frame: frame - (task2Start + 90), fps, config: { damping: 14, stiffness: 120 } })
                          : 1;

          const taskText =
            isFirst ? task1Text.slice(0, task1Visible) : isSecond ? task2Text.slice(0, task2Visible) : task.task;

          return (
            <div
              key={task.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 220px 160px',
                padding: '20px 36px',
                borderBottom: `1px solid ${BORDER}`,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 22,
                color: HEADER,
                alignItems: 'center',
                transform: `translateY(${interpolate(appear as number, [0, 1], [10, 0])}px)`,
                opacity: interpolate(appear as number, [0, 1], [0, 1]),
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: task.statusBg,
                    color: task.statusColor,
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: task.statusColor }} />
                  {task.statusLabel}
                </span>
              </div>
              <div style={{ fontWeight: 600 }}>{taskText}</div>
              <div style={{ color: MUTED, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(15, 23, 42, 0.15)',
                  }}
                >
                  <img
                    src={task.avatarUrl}
                    alt={task.owner}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span>{task.owner}</span>
              </div>
              <div style={{ color: MUTED, fontSize: 18 }}>{task.due}</div>
            </div>
          );
        })}
      </div>

      <Cursor x={cursorX} y={cursorY} opacity={panelFadeOut} />
    </AbsoluteFill>
  );
};
