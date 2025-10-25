import React, { useEffect, useState } from 'react';
import { Composition, getInputProps } from 'remotion';
import { MyComposition } from './Composition';
import RemotionComposition from './../app/_components/RemotionComposition';

const videoData = {
    audioUrl: '',
    captionJson: [
  {
    confidence: 0.9994961,
    end: 1.04,
    start: 0.39999998,
    word: "pandora's",
  },
  {
    confidence: 0.9943709,
    end: 1.52,
    start: 1.04,
    word: "curiosity",
  },
  {
    confidence: 0.99976796,
    end: 1.8399999,
    start: 1.52,
    word: "was",
  },
  {
    confidence: 0.9998306,
    end: 2,
    start: 1.8399999,
    word: "her",
  },
  {
    confidence: 0.9969835,
    end: 2.8,
    start: 2,
    word: "downfall",
  },
  {
    confidence: 0.9990336,
    end: 3.12,
    start: 2.96,
    word: "she",
  },
  {
    confidence: 0.9994149,
    end: 3.52,
    start: 3.12,
    word: "possessed",
  },
  {
    confidence: 0.9997466,
    end: 3.6799998,
    start: 3.52,
    word: "a",
  },
  {
    confidence: 0.972635,
    end: 4.08,
    start: 3.6799998,
    word: "jar",
  },
  {
    confidence: 0.9992506,
    end: 4.24,
    start: 4.08,
    word: "a",
  },
  {
    confidence: 0.99948525,
    end: 4.48,
    start: 4.24,
    word: "gift",
  },
  {
    confidence: 0.99699855,
    end: 4.64,
    start: 4.48,
    word: "she",
  },
  {
    confidence: 0.99991727,
    end: 4.72,
    start: 4.64,
    word: "was",
  },
  {
    confidence: 0.999925,
    end: 4.96,
    start: 4.72,
    word: "told",
  },
  {
    confidence: 0.99951696,
    end: 5.2799997,
    start: 4.96,
    word: "never",
  },
  {
    confidence: 0.99994576,
    end: 5.44,
    start: 5.2799997,
    word: "to",
  },
  {
    confidence: 0.8045952,
    end: 6.08,
    start: 5.44,
    word: "open",
  },
  {
    confidence: 0.9977933,
    end: 6.48,
    start: 6.24,
    word: "yet",
  },
  {
    confidence: 0.98735887,
    end: 7.04,
    start: 6.48,
    word: "temptation",
  },
  {
    confidence: 0.96484464,
    end: 7.44,
    start: 7.04,
    word: "gnawed",
  },
  {
    confidence: 0.9965905,
    end: 7.52,
    start: 7.44,
    word: "at",
  },
  {
    confidence: 0.9938125,
    end: 8,
    start: 7.52,
    word: "her",
  },
  {
    confidence: 0.99800676,
    end: 8.32,
    start: 8.08,
    word: "when",
  },
  {
    confidence: 0.99929607,
    end: 8.48,
    start: 8.32,
    word: "she",
  },
  {
    confidence: 0.99979705,
    end: 8.8,
    start: 8.48,
    word: "finally",
  },
  {
    confidence: 0.9998311,
    end: 9.12,
    start: 8.8,
    word: "lifted",
  },
  {
    confidence: 0.9998129,
    end: 9.28,
    start: 9.12,
    word: "the",
  },
  {
    confidence: 0.996873,
    end: 9.76,
    start: 9.28,
    word: "lid",
  },
  {
    confidence: 0.9988908,
    end: 9.92,
    start: 9.76,
    word: "all",
  },
  {
    confidence: 0.99942976,
    end: 10.08,
    start: 9.92,
    word: "the",
  },
  {
    confidence: 0.99983823,
    end: 10.48,
    start: 10.08,
    word: "evils",
  },
    ],
    images: ['https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg']
}

export const RemotionRoot = () => {
    // const [defaultData, setDefaultData] = useState(data);
    // const { videoData } = getInputProps(); // Get dynamic input props

    // useEffect(() => {
    //     if (videoData?.captionJson) {
    //         setDefaultData(videoData);
    //     }
    // }, [videoData]);

    return (
        <>
            <Composition
                id="youtubeShort"
                component={RemotionComposition}
                durationInFrames={900}
                fps={30}
                width={720}
                height={1280}
                defaultProps={{
                    videoData: videoData
                }}
            />
        </>
    );
};