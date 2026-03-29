import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

// --- Configuration ---
const ITEM_HEIGHT = 200; // Height of one result including margin
const HEADER_HEIGHT = 150; // Height of the fixed Google header
const TARGET_INDEX = 30; // The index where we stop
const TOTAL_ITEMS = 50;

// --- Colors ---
const BLUE = '#1a0dab';
const URL_COLOR = '#202124';
const DESC_COLOR = '#4d5156';

// --- Data Dictionary ---
const GENERIC_RESULTS = [
  {
    title: "The Ultimate Guide to Digital Strategies",
    url: "https://www.strategy-daily.com/guide",
    description: "Comprehensive breakdown of the latest digital strategies that are transforming industries worldwide. Learn how to adapt and thrive.",
    favicon: "📊",
  },
  {
    title: "Top 10 Tips for Efficient Workflows",
    url: "https://www.productivity-master.net/tips",
    description: "Boost your productivity with these proven tips. We cover time management, software tools, and organizational habits.",
    favicon: "⚡",
  },
  {
    title: "Understanding Market Trends in 2025",
    url: "https://www.market-watch-2025.com/trends",
    description: "Stay ahead of the curve with our deep dive into emerging market trends. Analysis from top financial experts and data scientists.",
    favicon: "📈",
  },
  {
    title: "How to Build a Successful Brand",
    url: "https://www.branding-101.org/build",
    description: "Branding is more than just a logo. Discover the secrets to building a brand that resonates with customers and stands the test of time.",
    favicon: "🎯",
  },
  {
    title: "The Future of Remote Work",
    url: "https://www.remote-work-news.com/future",
    description: "Is remote work here to stay? We analyze the data and interview industry leaders to predict the future of the workplace.",
    favicon: "💼",
  },
  {
    title: "Healthy Living: A Holistic Approach",
    url: "https://www.wellness-today.com/holistic",
    description: "Achieve balance in your life with our holistic approach to health. Nutrition, exercise, and mental wellness combined.",
    favicon: "🌿",
  },
  {
    title: "Tech Reviews: Best Gadgets of the Year",
    url: "https://www.tech-radar-reviews.com/best",
    description: "Our editors pick the top gadgets of the year. From smartphones to smart home devices, see what made the list.",
    favicon: "📱",
  },
  {
    title: "Travel on a Budget: Hidden Gems",
    url: "https://www.travel-smart.com/budget",
    description: "You don't need a fortune to see the world. Explore these amazing destinations that are affordable and unforgettable.",
    favicon: "✈️",
  },
  {
    title: "Mastering the Art of Negotiation",
    url: "https://www.business-skills.net/negotiation",
    description: "Negotiation is a critical skill in business and life. Learn key techniques to get what you want while maintaining relationships.",
    favicon: "🤝",
  },
  {
    title: "Sustainable Living for Beginners",
    url: "https://www.eco-friendly-life.org/start",
    description: "Simple steps you can take today to live a more sustainable lifestyle. Reduce your carbon footprint and save money.",
    favicon: "♻️",
  },
];

// --- Types ---
type ResultData = {
  id: number;
  title: string;
  url: string;
  description: string;
  favicon: string;
  isClient?: boolean;
};

// --- 1. Helper: Generate 50 Mock Items ---
const generateMockData = (): ResultData[] => {
  const data: ResultData[] = [];

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    if (i === TARGET_INDEX) {
      // THE TARGET CLIENT
      data.push({
        id: i,
        title: "YOUR CLIENT | The Best Solution For You",
        url: "https://www.yourclient-website.com/solutions",
        description: "This is the result you have been looking for. We offer superior services, amazing products, and exactly what the user searched for.",
        favicon: "⭐",
        isClient: true
      });
    } else {
      // GENERIC FILLER
      const template = GENERIC_RESULTS[i % GENERIC_RESULTS.length];
      data.push({
        id: i,
        title: template.title,
        url: template.url,
        description: template.description,
        favicon: template.favicon,
        isClient: false
      });
    }
  }
  return data;
};

// --- 2. Component: Single Search Result ---
const SearchResultItem: React.FC<{ data: ResultData }> = ({ data }) => {
  return (
    <div
      style={{
        height: ITEM_HEIGHT - 30, // subtract margin
        marginBottom: 30,
        fontFamily: 'arial,sans-serif',
        maxWidth: 800,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: 'white',
      }}
    >
      <div style={{ flex: 1 }}>
        {/* URL Row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', backgroundColor: data.isClient ? '#e8f0fe' : '#f1f3f4',
            marginRight: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
          }}>
            {data.favicon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 18, color: URL_COLOR }}>
              {data.isClient ? 'Your Client' : 'Example Site'}
            </span>
            <span style={{ fontSize: 16, color: '#5f6368' }}>{data.url}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0, fontSize: 26, color: BLUE, fontWeight: 400,
          cursor: 'pointer', lineHeight: '1.3'
        }}>
          {data.title}
        </h3>

        {/* Description */}
        <div style={{ marginTop: 10, fontSize: 18, color: DESC_COLOR, lineHeight: '1.58' }}>
          {data.description}
        </div>
      </div>
    </div>
  );
};

// --- 3. Component: Static Header ---
const Header: React.FC<{ keyword: string }> = ({ keyword }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, width: '100%', height: HEADER_HEIGHT,
    backgroundColor: 'white', borderBottom: '1px solid #ebebeb', zIndex: 10,
    display: 'flex', alignItems: 'center', paddingLeft: 40
  }}>
    <span style={{ fontFamily: '"Product Sans", Arial', fontSize: 45, marginRight: 50, userSelect: 'none' }}>
      <span style={{ color: '#4285F4' }}>G</span>
      <span style={{ color: '#EA4335' }}>o</span>
      <span style={{ color: '#FBBC05' }}>o</span>
      <span style={{ color: '#4285F4' }}>g</span>
      <span style={{ color: '#34A853' }}>l</span>
      <span style={{ color: '#EA4335' }}>e</span>
    </span>
    <div style={{
      width: 800, height: 58, borderRadius: 30, border: '1px solid transparent',
      boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)', display: 'flex', alignItems: 'center', padding: '0 26px', fontSize: 20
    }}>
      {keyword}
    </div>
  </div>
);

// --- Props Type ---
export type GoogleSearchResultsProps = {
  keyword?: string;
};

// --- 4. Main Scene ---
export const GoogleSearchResults: React.FC<GoogleSearchResultsProps> = ({ 
  keyword = 'Your Client Service Keywords' 
}) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  // Create data once
  const results = useMemo(() => generateMockData(), []);

  // --- ZOOM / INTRO ANIMATION ---
  const ZOOM_DURATION = 40;

  const zoomProgress = interpolate(
    frame,
    [0, ZOOM_DURATION],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const currentScale = interpolate(zoomProgress, [0, 1], [1.2, 1]);

  // --- SCROLL CALCULATION ---
  const targetPosition = TARGET_INDEX * ITEM_HEIGHT;
  const targetScreenOffset = HEADER_HEIGHT + 30;
  const finalScrollY = -(targetPosition) + targetScreenOffset;

  // Animation Timing
  const SCROLL_DURATION = 90;
  const WAIT_AT_START = 20;

  const scrollProgress = interpolate(
    frame,
    [WAIT_AT_START, WAIT_AT_START + SCROLL_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const currentScrollY = interpolate(
    scrollProgress,
    [0, 1],
    [0, finalScrollY]
  );

  // Optional: Highlight effect on the target when scroll finishes
  const highlightOpacity = interpolate(
    frame,
    [WAIT_AT_START + SCROLL_DURATION, WAIT_AT_START + SCROLL_DURATION + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- SPOTLIGHT ANIMATION ---
  const SPOTLIGHT_START = WAIT_AT_START + SCROLL_DURATION + 15;
  const SPOTLIGHT_DURATION = 30;

  const spotlightProgress = interpolate(
    frame,
    [SPOTLIGHT_START, SPOTLIGHT_START + SPOTLIGHT_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const fadeOutOpacity = interpolate(spotlightProgress, [0, 0.5], [1, 0]);
  const clientScale = interpolate(spotlightProgress, [0, 1], [1, 2]);

  // Calculate Centers
  const clientCenterYOffset = interpolate(spotlightProgress, [0, 1], [0, height / 2 - targetScreenOffset - 250]);
  const clientCenterXOffset = interpolate(spotlightProgress, [0, 1], [0, 380]);


  // --- PHASE 5: SHIFT DOWN & TEXT SEQUENCING ---
  
  // 1. Initial Reveal (Result shifts down, Text 1 appears)
  const TEXT_1_START = SPOTLIGHT_START + SPOTLIGHT_DURATION + 10;
  const TEXT_1_DURATION = 30;

  const text1Progress = interpolate(
    frame,
    [TEXT_1_START, TEXT_1_START + TEXT_1_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Shift result down
  const shiftDownY = interpolate(text1Progress, [0, 1], [0, 200]);

  // Text 1: "Feels Relatable?" properties
  const text1Opacity = interpolate(
    frame,
    [TEXT_1_START, TEXT_1_START + 20], 
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  const text1TranslateY = interpolate(text1Progress, [0, 1], [20, 0]);

  // 2. Text Swap (Text 1 fades out, Text 2 appears)
  const TEXT_SWAP_START = TEXT_1_START + 50; // Hold Text 1 for 50 frames
  const TEXT_SWAP_DURATION = 20;

  // Fade out Text 1
  const text1ExitOpacity = interpolate(
    frame,
    [TEXT_SWAP_START, TEXT_SWAP_START + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const text1TranslateYExit = interpolate(
    frame,
    [TEXT_SWAP_START, TEXT_SWAP_START + 10],
    [0, -20], // Move up slightly as it disappears
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade in Text 2: "Let's fix this!"
  const text2Opacity = interpolate(
    frame,
    [TEXT_SWAP_START + 5, TEXT_SWAP_START + TEXT_SWAP_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const text2TranslateY = interpolate(
    frame,
    [TEXT_SWAP_START + 5, TEXT_SWAP_START + TEXT_SWAP_DURATION],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Combine opacities for Text 1 (Entrance and Exit)
  const finalText1Opacity = text1Opacity * text1ExitOpacity;
  // Combine Translate for Text 1
  const finalText1Y = text1TranslateY + text1TranslateYExit;

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>

      {/* 1. TEXT LAYER (Centered in the gap created by shifting down) */}
      <div
        style={{
          position: 'absolute',
          top: '40%', 
          width: '100%',
          textAlign: 'center',
          zIndex: 1000,
          // We use a relative container for the two absolute text elements to sit on top of each other
          height: 120, 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
         {/* TEXT 1: Feels Relatable? */}
        <h1 style={{
          position: 'absolute',
          fontFamily: '"Product Sans", Arial, sans-serif',
          fontSize: 100,
          color: '#99543fff',
          margin: 0,
          opacity: finalText1Opacity,
          transform: `translateY(${finalText1Y}px)`,
        }}>
          Feels relatable?
        </h1>

         {/* TEXT 2: Let's fix this! */}
         <h1 style={{
          position: 'absolute',
          fontFamily: '"Product Sans", Arial, sans-serif',
          fontSize: 100,
          color: '#99543fff',
          margin: 0,
          opacity: text2Opacity,
          transform: `translateY(${text2TranslateY}px)`,
        }}>
          Let's fix this!
        </h1>
      </div>

      {/* 2. THE SEARCH RESULTS LAYER */}
      {/* Zoom Container */}
      <AbsoluteFill
        style={{
          transform: `scale(${currentScale})`,
          transformOrigin: '0% 0%',
        }}
      >
        <div style={{ opacity: fadeOutOpacity }}>
          <Header keyword={keyword} />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 180,
            width: '100%',
            transform: `translateY(${currentScrollY}px)`,
            paddingTop: HEADER_HEIGHT + 30,
          }}
        >
          <div style={{ color: '#70757a', fontSize: 18, marginBottom: 25, opacity: fadeOutOpacity }}>
            About 50,000,000 results (0.55 seconds)
          </div>

          {results.map((item) => {
            const itemOpacity = item.isClient ? 1 : fadeOutOpacity;

            // combine the center offset + the new shift down
            const totalYOffset = clientCenterYOffset + shiftDownY;

            const itemTransform = item.isClient
              ? `translate(${clientCenterXOffset}px, ${totalYOffset}px) scale(${clientScale})`
              : 'none';

            return (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  width: 800,
                  opacity: itemOpacity,
                  transform: itemTransform,
                  transformOrigin: 'center center',
                }}
              >
                <SearchResultItem data={item} />

                {item.isClient && (
                  <div
                    style={{
                      position: 'absolute',
                      left: -20,
                      top: -10,
                      width: 840,
                      height: ITEM_HEIGHT - 10,
                      border: '2px solid #4285F4',
                      borderRadius: 12,
                      pointerEvents: 'none',
                      // Fade out the border when the text reveals (optional, looks cleaner)
                      opacity: highlightOpacity * (1 - spotlightProgress),
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Scrollbar */}
        <div
          style={{
            position: 'absolute',
            right: 4,
            top: HEADER_HEIGHT,
            width: 8,
            height: height - HEADER_HEIGHT,
            backgroundColor: '#f1f1f1',
            opacity: fadeOutOpacity
          }}
        >
          <div
            style={{
              width: '100%',
              height: 100,
              backgroundColor: '#c1c1c1',
              borderRadius: 4,
              transform: `translateY(${interpolate(scrollProgress, [0, 1], [0, height - HEADER_HEIGHT - 100])}px)`
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
