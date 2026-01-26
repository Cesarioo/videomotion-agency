import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion';

// --- Colors ---
const COLOR_TECH = '#2c3e50';
const COLOR_CONTENT = '#27ae60';
const COLOR_LINKS = '#8e44ad';
const TEXT_COLOR = '#ffffff';

// --- Icons / SVGs ---

const AuditIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.82, 1], { extrapolateRight: 'clamp', easing: Easing.elastic(1) });
  const driftX = Math.sin(frame * 0.05) * 4;
  const driftY = Math.cos(frame * 0.06) * 3;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      style={{ transform: `translate(${driftX}px, ${driftY}px) scale(${scale})` }}
    >
      <g>
        <ellipse style={{ opacity: 0.5, fill: '#27A2DB' }} cx="158.537" cy="158.536" rx="129.777" ry="129.777" />
        <path
          style={{ opacity: 0.5, fill: '#FFFFFF' }}
          d="M98.081,234.62c-43.316-43.315-43.882-112.979-1.264-155.595c9.509-9.511,20.41-16.745,32.021-21.96c-16.497,4.812-32.056,13.702-45.064,26.71c-41.288,41.289-41.289,108.231,0,149.521c18.282,18.281,41.596,28.431,65.483,30.523C130.561,258.986,112.79,249.33,98.081,234.62z"
        />
        <path
          style={{ fill: '#3A556A' }}
          d="M270.636,46.433c-61.912-61.912-162.291-61.911-224.202,0.001s-61.912,162.291-0.001,224.202c57.054,57.054,146.703,61.394,208.884,13.294l14.18,14.182l28.615-28.613l-14.182-14.182C332.029,193.137,327.69,103.487,270.636,46.433z M250.301,250.302c-50.681,50.681-132.852,50.681-183.534,0c-50.68-50.681-50.68-132.852,0.002-183.533s132.85-50.681,183.531,0C300.982,117.45,300.982,199.621,250.301,250.302z"
        />
        <path
          style={{ fill: '#E56353' }}
          d="M305.823,258.865l-46.959,46.958c-2.669,2.67-2.669,6.996,0,9.665l174.339,174.338c12.132,12.133,68.755-44.49,56.623-56.623L315.488,258.865C312.819,256.196,308.493,256.196,305.823,258.865z"
        />
        <rect
          x="409.379"
          y="442.628"
          transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 1084.9951 449.4294)"
          style={{ fill: '#EBF0F3' }}
          width="80.077"
          height="13.594"
        />
        <rect
          x="260.671"
          y="293.889"
          transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 725.9606 300.6683)"
          style={{ fill: '#EBF0F3' }}
          width="80.077"
          height="13.594"
        />
      </g>
    </svg>
  );
};

const PlanningIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const penX = Math.sin(frame * 0.08) * 6;
  const penY = Math.cos(frame * 0.08) * 2;
  const lineProgress = interpolate(frame % 60, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <svg width={size} height={size} viewBox="0 0 112.83 122.88">
      <path
        fill="#e8f4ff"
        fillRule="evenodd"
        d="M103.3,34.19l8.23,3.52a2.15,2.15,0,0,1,1.13,2.82l-2,4.56L98.53,39.88l2-4.56a2.15,2.15,0,0,1,2.82-1.13ZM8.88,7.88h8.19V2.73a2.74,2.74,0,0,1,5.47,0V7.88h12V2.73a2.73,2.73,0,1,1,5.46,0V7.88H52V2.73a2.73,2.73,0,0,1,5.46,0V7.88h12V2.73a2.73,2.73,0,0,1,5.46,0V7.88h9.27a8.91,8.91,0,0,1,8.88,8.88V28.54a12.27,12.27,0,0,0-1.76,2.9l-2,4.56A10,10,0,0,0,89,37.16a11.24,11.24,0,0,0-.58,1.15l-.6,1.4V16.76a3.6,3.6,0,0,0-3.58-3.58H75v5.15a2.73,2.73,0,0,1-5.46,0V13.18h-12v5.15a2.73,2.73,0,0,1-5.46,0V13.18H40v5.15a2.73,2.73,0,1,1-5.46,0V13.18h-12v5.15a2.74,2.74,0,0,1-5.47,0V13.18H8.88A3.58,3.58,0,0,0,5.3,16.76v92a3.6,3.6,0,0,0,3.58,3.59H59.16l.56,5.29H8.88A8.89,8.89,0,0,1,0,108.77v-92A8.91,8.91,0,0,1,8.88,7.88ZM20.34,94.35a2.65,2.65,0,0,1,0-5.3H66.72l-2.27,5.3Zm0-17.48a2.65,2.65,0,0,1,0-5.3H72.78a2.52,2.52,0,0,1,1.27.35l-2.12,5Zm0-17.48a2.65,2.65,0,0,1,0-5.3H72.78a2.65,2.65,0,0,1,0,5.3Zm0-17.48a2.65,2.65,0,0,1,0-5.3H72.78a2.65,2.65,0,0,1,0,5.3ZM81,114.6l-6.19,5c-4.85,3.92-4.36,5.06-5-.88l-1-9.34h0L97.54,42.18l12.18,5.22L81,114.6Zm-10.09-4.31,8,3.42L74.82,117c-3.19,2.58-2.87,3.32-3.28-.57l-.66-6.14Z"
      />
      <line
        x1="20"
        y1="76"
        x2={20 + 45 * lineProgress}
        y2="76"
        stroke="#2ecc71"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

const DeliveryIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const wheelSpin = frame * 4;
  const speedShift = interpolate(frame % 30, [0, 15, 30], [0, -6, 0], { extrapolateRight: 'clamp' });

  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      <g transform={`translate(${speedShift} 0)`} opacity="0.6">
        <rect x="40" y="340" width="80" height="10" fill="#ecf0f1" />
        <rect x="20" y="370" width="110" height="10" fill="#ecf0f1" />
        <rect x="55" y="400" width="70" height="10" fill="#ecf0f1" />
      </g>
      <g transform="translate(0 -540.36)" fill="#f1c40f">
        <path d="M401.5,863.31c-12,0-23.4,4.7-32,13.2c-8.6,8.6-13.4,19.8-13.4,31.8s4.7,23.2,13.4,31.8c8.7,8.5,20,13.2,32,13.2c24.6,0,44.6-20.2,44.6-45S426.1,863.31,401.5,863.31z M401.5,933.31c-13.8,0-25.4-11.4-25.4-25s11.6-25,25.4-25c13.6,0,24.6,11.2,24.6,25S415.1,933.31,401.5,933.31z" />
        <path d="M413.1,713.41c-1.8-1.7-4.2-2.6-6.7-2.6h-51.3c-5.5,0-10,4.5-10,10v82c0,5.5,4.5,10,10,10h81.4c5.5,0,10-4.5,10-10v-54.9c0-2.8-1.2-5.5-3.3-7.4L413.1,713.41z M426.5,792.81h-61.4v-62.1h37.4l24,21.6V792.81z" />
        <path d="M157.3,863.31c-12,0-23.4,4.7-32,13.2c-8.6,8.6-13.4,19.8-13.4,31.8s4.7,23.2,13.4,31.8c8.7,8.5,20,13.2,32,13.2c24.6,0,44.6-20.2,44.6-45S181.9,863.31,157.3,863.31z M157.3,933.31c-13.8,0-25.4-11.4-25.4-25s11.6-25,25.4-25c13.6,0,24.6,11.2,24.6,25S170.9,933.31,157.3,933.31z" />
        <path d="M90.6,875.61H70.5v-26.6c0-5.5-4.5-10-10-10s-10,4.5-10,10v36.6c0,5.5,4.5,10,10,10h30.1c5.5,0,10-4.5,10-10S96.1,875.61,90.6,875.61z" />
        <path d="M141.3,821.11c0-5.5-4.5-10-10-10H10c-5.5,0-10,4.5-10,10s4.5,10,10,10h121.3C136.8,831.11,141.3,826.71,141.3,821.11z" />
        <path d="M30.3,785.01l121.3,0.7c5.5,0,10-4.4,10.1-9.9c0.1-5.6-4.4-10.1-9.9-10.1l-121.3-0.7c-0.1,0-0.1,0-0.1,0c-5.5,0-10,4.4-10,9.9C20.3,780.51,24.8,785.01,30.3,785.01z" />
        <path d="M50.7,739.61H172c5.5,0,10-4.5,10-10s-4.5-10-10-10H50.7c-5.5,0-10,4.5-10,10S45.2,739.61,50.7,739.61z" />
        <path d="M487.4,726.11L487.4,726.11l-71.6-59.3c-1.8-1.5-4-2.3-6.4-2.3h-84.2v-36c0-5.5-4.5-10-10-10H60.5c-5.5,0-10,4.5-10,10v73.2c0,5.5,4.5,10,10,10s10-4.5,10-10v-63.2h234.8v237.1h-82c-5.5,0-10,4.5-10,10s4.5,10,10,10h122.1c5.5,0,10-4.5,10-10s-4.5-10-10-10h-20.1v-191.1h80.6l65.2,54l-0.7,136.9H460c-5.5,0-10,4.5-10,10s4.5,10,10,10h20.3c5.5,0,10-4.4,10-9.9l0.8-151.6C491,730.91,489.7,728.01,487.4,726.11z" />
        <g transform={`translate(157.3 908.31) rotate(${wheelSpin}) translate(-157.3 -908.31)`}>
          <circle cx="157.3" cy="908.31" r="18" fill="#bdc3c7" />
          <line x1="157.3" y1="890.31" x2="157.3" y2="926.31" stroke="#2c3e50" strokeWidth="4" />
          <line x1="139.3" y1="908.31" x2="175.3" y2="908.31" stroke="#2c3e50" strokeWidth="4" />
        </g>
        <g transform={`translate(401.5 908.31) rotate(${wheelSpin}) translate(-401.5 -908.31)`}>
          <circle cx="401.5" cy="908.31" r="18" fill="#bdc3c7" />
          <line x1="401.5" y1="890.31" x2="401.5" y2="926.31" stroke="#2c3e50" strokeWidth="4" />
          <line x1="383.5" y1="908.31" x2="419.5" y2="908.31" stroke="#2c3e50" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
};

// --- Panel Component ---

const Panel: React.FC<{
  title: string;
  color: string;
  delay: number;
  zIndex: number;
  widthPercentage: number;
  children: React.ReactNode;
}> = ({ title, color, delay, zIndex, widthPercentage, children }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Entrance spring animation (coming in from left)
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12 },
  });

  const translateX = interpolate(entrance, [0, 1], [-width, 0]);

  return (
    <div
      style={{
        width: `${widthPercentage}%`,
        height: '100%',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${translateX}px)`,
        zIndex,
        overflow: 'hidden', // Revert back to hidden since logo stays inside
        borderRight: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}

        {title && (
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            color: TEXT_COLOR,
            fontSize: 50,
            textTransform: 'uppercase',
            letterSpacing: 4,
            margin: 0,
            marginTop: 40,
            whiteSpace: 'nowrap'
          }}>
            {title}
          </h2>
        )}
      </div>
    </div>
  );
};


// --- Main Scene ---

export const ThreeThemesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // --- ANIMATION CONFIG ---
  const SLIDE_START = 90;
  const DURATION = 30;

  const progress = interpolate(frame, [SLIDE_START, SLIDE_START + DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Slide Everything to the Right by 100% of width
  const containerSlide = interpolate(progress, [0, 1], [0, width]);
  const bgProgress = interpolate(frame, [SLIDE_START - 30, SLIDE_START], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const bgColor = interpolateColors(bgProgress, [0, 1], ['white', COLOR_TECH]);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      
      {/* Container that holds all panels and slides right */}
      <div 
        style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            width: '100%', 
            height: '100%',
            transform: `translateX(${containerSlide}px)` // Slide the whole group
        }}
      >

        {/* 1. Audit */}
        <Panel
            title="Audit"
            color={COLOR_TECH}
            delay={0}
            zIndex={3}
            widthPercentage={33.333}
        >
            {/* The Logo - Now standard position */}
            <AuditIcon size={150} />
        </Panel>

        {/* 2. Planning */}
        <Panel 
            title="Planning" 
            color={COLOR_CONTENT} 
            delay={5} 
            zIndex={2} 
            widthPercentage={33.333} 
        >
            <PlanningIcon size={120} />
        </Panel>

        {/* 3. Deliverying */}
        <Panel 
            title="Deliverying" 
            color={COLOR_LINKS} 
            delay={10} 
            zIndex={1} 
            widthPercentage={33.333} 
        >
            <DeliveryIcon size={120} />
        </Panel>
      </div>

    </AbsoluteFill>
  );
};
