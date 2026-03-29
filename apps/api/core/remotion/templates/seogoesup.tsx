import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

// --- Configuration ---
const ITEM_HEIGHT = 200;
const HEADER_HEIGHT = 150;
const TARGET_INDEX = 18;
const TOTAL_ITEMS = 50;

// --- Colors ---
const BLUE = '#1a0dab';
const URL_COLOR = '#202124';
const DESC_COLOR = '#4d5156';

// --- Data Dictionary ---
const GENERIC_RESULTS = [
  {
    title: 'The Ultimate Guide to Digital Strategies',
    url: 'https://www.strategy-daily.com/guide',
    description:
      'Comprehensive breakdown of the latest digital strategies that are transforming industries worldwide. Learn how to adapt and thrive.',
    favicon: '📊',
  },
  {
    title: 'Top 10 Tips for Efficient Workflows',
    url: 'https://www.productivity-master.net/tips',
    description:
      'Boost your productivity with these proven tips. We cover time management, software tools, and organizational habits.',
    favicon: '⚡',
  },
  {
    title: 'Understanding Market Trends in 2025',
    url: 'https://www.market-watch-2025.com/trends',
    description:
      'Stay ahead of the curve with our deep dive into emerging market trends. Analysis from top financial experts and data scientists.',
    favicon: '📈',
  },
  {
    title: 'How to Build a Successful Brand',
    url: 'https://www.branding-101.org/build',
    description:
      'Branding is more than just a logo. Discover the secrets to building a brand that resonates with customers and stands the test of time.',
    favicon: '🎯',
  },
  {
    title: 'The Future of Remote Work',
    url: 'https://www.remote-work-news.com/future',
    description:
      'Is remote work here to stay? We analyze the data and interview industry leaders to predict the future of the workplace.',
    favicon: '💼',
  },
  {
    title: 'Healthy Living: A Holistic Approach',
    url: 'https://www.wellness-today.com/holistic',
    description:
      'Achieve balance in your life with our holistic approach to health. Nutrition, exercise, and mental wellness combined.',
    favicon: '🌿',
  },
  {
    title: 'Tech Reviews: Best Gadgets of the Year',
    url: 'https://www.tech-radar-reviews.com/best',
    description:
      'Our editors pick the top gadgets of the year. From smartphones to smart home devices, see what made the list.',
    favicon: '📱',
  },
  {
    title: 'Travel on a Budget: Hidden Gems',
    url: 'https://www.travel-smart.com/budget',
    description:
      "You don't need a fortune to see the world. Explore these amazing destinations that are affordable and unforgettable.",
    favicon: '✈️',
  },
  {
    title: 'Mastering the Art of Negotiation',
    url: 'https://www.business-skills.net/negotiation',
    description:
      'Negotiation is a critical skill in business and life. Learn key techniques to get what you want while maintaining relationships.',
    favicon: '🤝',
  },
  {
    title: 'Sustainable Living for Beginners',
    url: 'https://www.eco-friendly-life.org/start',
    description:
      'Simple steps you can take today to live a more sustainable lifestyle. Reduce your carbon footprint and save money.',
    favicon: '♻️',
  },
];

type ResultData = {
  id: number;
  title: string;
  url: string;
  description: string;
  favicon: string;
  isClient?: boolean;
};

const generateMockData = (): ResultData[] => {
  const data: ResultData[] = [];

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    if (i === TARGET_INDEX) {
      data.push({
        id: i,
        title: 'YOUR WEBSITE | The Best Solution For You',
        url: 'https://www.your-website.com/solutions',
        description:
          'This is the result you have been looking for. We offer superior services, amazing products, and exactly what the user searched for.',
        favicon: '⭐',
        isClient: true,
      });
    } else {
      const template = GENERIC_RESULTS[i % GENERIC_RESULTS.length];
      data.push({
        id: i,
        title: template.title,
        url: template.url,
        description: template.description,
        favicon: template.favicon,
        isClient: false,
      });
    }
  }
  return data;
};

const SearchResultItem: React.FC<{ data: ResultData; opacity: number }> = ({ data, opacity }) => (
  <div
    style={{
      height: ITEM_HEIGHT - 30,
      marginBottom: 30,
      fontFamily: 'arial,sans-serif',
      maxWidth: 800,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: 'white',
      opacity,
    }}
  >
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: data.isClient ? '#e8f0fe' : '#f1f3f4',
            marginRight: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {data.favicon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, color: URL_COLOR }}>{data.isClient ? 'Your Website' : 'Example Site'}</span>
          <span style={{ fontSize: 16, color: '#5f6368' }}>{data.url}</span>
        </div>
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: 26,
          color: BLUE,
          fontWeight: 400,
          cursor: 'pointer',
          lineHeight: '1.3',
        }}
      >
        {data.title}
      </h3>

      <div style={{ marginTop: 10, fontSize: 18, color: DESC_COLOR, lineHeight: '1.58' }}>{data.description}</div>
    </div>
  </div>
);

const Header: React.FC<{ keyword: string }> = ({ keyword }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: HEADER_HEIGHT,
      backgroundColor: 'white',
      borderBottom: '1px solid #ebebeb',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 40,
    }}
  >
    <span style={{ fontFamily: '"Product Sans", Arial', fontSize: 45, marginRight: 50, userSelect: 'none' }}>
      <span style={{ color: '#4285F4' }}>G</span>
      <span style={{ color: '#EA4335' }}>o</span>
      <span style={{ color: '#FBBC05' }}>o</span>
      <span style={{ color: '#4285F4' }}>g</span>
      <span style={{ color: '#34A853' }}>l</span>
      <span style={{ color: '#EA4335' }}>e</span>
    </span>
    <div
      style={{
        width: 800,
        height: 58,
        borderRadius: 30,
        border: '1px solid transparent',
        boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 26px',
        fontSize: 20,
      }}
    >
      {keyword}
    </div>
  </div>
);

export type SeoGoesUpProps = {
  keyword?: string;
};

export const SeoGoesUp: React.FC<SeoGoesUpProps> = ({
  keyword = 'Your Client Service Keywords',
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const results = useMemo(() => generateMockData(), []);

  const ZOOM_DURATION = 35;
  const zoomProgress = interpolate(frame, [0, ZOOM_DURATION], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const currentScale = interpolate(zoomProgress, [0, 1], [1.15, 1]);

  const targetPosition = TARGET_INDEX * ITEM_HEIGHT;
  const startScreenOffset = HEADER_HEIGHT + 260;
  const finalScreenOffset = HEADER_HEIGHT + 30;

  const initialScrollY = -targetPosition + startScreenOffset;
  const finalScrollY = -targetPosition + finalScreenOffset;

  const SCROLL_START = 10;
  const SCROLL_DURATION = 90;
  const scrollProgress = interpolate(frame, [SCROLL_START, SCROLL_START + SCROLL_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const currentScrollY = interpolate(scrollProgress, [0, 1], [initialScrollY, 0]);
  const clientLift = interpolate(scrollProgress, [0, 1], [0, -TARGET_INDEX * ITEM_HEIGHT]);
  const topSlotShift = interpolate(scrollProgress, [0, 1], [0, ITEM_HEIGHT]);
  const highlightPulse = 0.7 + 0.3 * Math.sin(frame * 0.1);
  const highlightFade = interpolate(frame, [SCROLL_START + SCROLL_DURATION, SCROLL_START + SCROLL_DURATION + 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clientScale = interpolate(scrollProgress, [0, 1], [1, 1.06]);
  const dimFade = interpolate(
    frame,
    [SCROLL_START + SCROLL_DURATION, SCROLL_START + SCROLL_DURATION + 15],
    [0.45, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const clientScaleEnd = interpolate(
    frame,
    [SCROLL_START + SCROLL_DURATION, SCROLL_START + SCROLL_DURATION + 15],
    [1.06, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <AbsoluteFill style={{ transform: `scale(${currentScale})`, transformOrigin: '0% 0%' }}>
        <Header keyword={keyword} />

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
          <div style={{ color: '#70757a', fontSize: 18, marginBottom: 25, opacity: 0.8 }}>
            About 50,000,000 results (0.55 seconds)
          </div>

          {results.map((item) => {
            const dimmed = !item.isClient;
            const itemOpacity = dimmed ? dimFade : 1;
            const itemTransform = item.isClient
              ? `translateY(${clientLift}px) scale(${clientScaleEnd})`
              : item.id < TARGET_INDEX
                ? `translateY(${topSlotShift}px)`
                : 'none';

            return (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  width: 800,
                  transform: itemTransform,
                  transformOrigin: 'center center',
                }}
              >
                <SearchResultItem data={item} opacity={itemOpacity} />

                {item.isClient && (
                  <div
                    style={{
                      position: 'absolute',
                      left: -20,
                      top: -10,
                      width: 840,
                      height: ITEM_HEIGHT - 10,
                      border: '3px solid #4285F4',
                      borderRadius: 12,
                      pointerEvents: 'none',
                      boxShadow: '0 6px 16px rgba(66, 133, 244, 0.25)',
                      opacity: highlightPulse * highlightFade,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            right: 4,
            top: HEADER_HEIGHT,
            width: 8,
            height: height - HEADER_HEIGHT,
            backgroundColor: '#f1f1f1',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 100,
              backgroundColor: '#c1c1c1',
              borderRadius: 4,
              transform: `translateY(${interpolate(scrollProgress, [0, 1], [0, height - HEADER_HEIGHT - 100])}px)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
