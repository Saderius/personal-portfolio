import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'profile' | 'article';
}

export function SeoHead({
  title = "Patryk 'Saderius' Mroziński | Game Developer & UI/UX Designer",
  description = "Patryk Mroziński (Saderius) is a Game Developer, UI/UX Designer, and Wear OS Developer. Experienced in designing immersive game UIs and leading QA for hit titles like House Flipper.",
  keywords = ["Game Developer", "UI/UX Designer", "Wear OS Designer", "Android Developer", "Patryk Mrozinski", "Saderius", "Survival Game Design", "House Flipper QA", "Jetpack Compose Designer", "Unreal Engine UI"],
  image = "https://i.imgur.com/JyGRmNR.gif",
  url = "https://saderius.com",
  type = 'profile'
}: SeoHeadProps) {
  const siteName = "Saderius Portfolio";
  
  // JSON-LD Structured Data for AEO
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Patryk Mroziński",
    "alternateName": "Saderius",
    "url": url,
    "image": image,
    "jobTitle": "Game Developer & UI/UX Designer",
    "knowsAbout": [
      "Game Design",
      "UI/UX Design",
      "Wear OS Development",
      "Android Development",
      "Quality Assurance Leadership",
      "React",
      "Jetpack Compose",
      "Unreal Engine",
      "Python Automation"
    ],
    "description": description,
    "sameAs": [
      "https://github.com/Saderius",
      "https://www.linkedin.com/in/saderius/",
      "https://www.facebook.com/saderius/",
      "https://www.instagram.com/saderius/"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What games has Patryk Mroziński (Saderius) worked on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Patryk has extensive experience in the games industry. He designed intuitive UI for top-tier survival games as a Game Designer. Previously, he served as a QA Test Lead and covered over 60 projects including 'House Flipper' and 'Car Mechanic Simulator'."
        }
      },
      {
        "@type": "Question",
        "name": "What does Saderius do in Wear OS and Android Development?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Saderius creates polished, touch-optimized applications for Android and smartwatches. Key projects include 'Scribble', a visual sticky note app built with Jetpack Compose for wrist-first interactions, and 'WearSweeper', a touch-optimized Minesweeper reimagined for round watch faces."
        }
      },
      {
        "@type": "Question",
        "name": "What is Patryk's technical stack as a Game and Web Developer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "His technical stack includes React, TypeScript, HTML/CSS, and Tailwind for Web Development. For Game and App Development, he utilizes Unreal Engine, Jetpack Compose, Python, and Figma for UI/UX Design."
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* AEO Hint: AI engines look for clear semantic markers */}
      <meta name="author" content="Patryk Mroziński" />
      <meta name="theme-color" content="#6366f1" />
    </Helmet>
  );
}
