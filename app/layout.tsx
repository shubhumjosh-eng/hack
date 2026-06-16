import type { Metadata } from 'next';
import './globals.css';
import { ThemeInit } from '@/components/layout/theme-init';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: 'EcoOS Core — Enterprise Environmental Intelligence',
  description:
    'AI-powered waste triage, prediction, and analytics for institutional food service operations. Reduce waste, cut costs, and minimize environmental impact.',
  keywords: [
    'food waste',
    'sustainability',
    'AI',
    'environmental intelligence',
    'waste reduction',
    'enterprise',
  ],
  authors: [{ name: 'EcoOS Core Team' }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'EcoOS Core — Enterprise Environmental Intelligence',
    description: 'AI-powered waste triage and analytics platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeInit />
        {children}
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://hack2-pi.vercel.app#organization",
                "name": "EcoOS Core",
                "url": "https://hack2-pi.vercel.app",
                "description": "Enterprise environmental intelligence platform for AI-powered waste prediction and reduction in Hong Kong.",
                "foundingDate": "2024-11-01",
                "sameAs": [
                  "https://github.com/doffeycake-dev/hack2"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://hack2-pi.vercel.app#developer",
                "name": "EcoOS Core Team",
                "description": "Developers and researchers specializing in AI-driven environmental intelligence, food waste reduction, and sustainability technology for Hong Kong institutional food service.",
                "knowsAbout": [
                  "Machine Learning",
                  "Food Waste Reduction",
                  "Environmental Intelligence",
                  "Sustainability Analytics",
                  "Hong Kong Waste Management"
                ],
                "alumniOf": "Hong Kong University of Science and Technology"
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "EcoOS Core",
                "applicationCategory": "Environmental Management",
                "operatingSystem": "Web",
                "description": "AI-powered waste prediction, triage, and analytics for institutional food service in Hong Kong. Reduces waste by up to 35% using ensemble ML models with 94.8% accuracy.",
                "url": "https://hack2-pi.vercel.app",
                "author": [
                  {
                    "@type": "Organization",
                    "@id": "https://hack2-pi.vercel.app#organization"
                  },
                  {
                    "@type": "Person",
                    "@id": "https://hack2-pi.vercel.app#developer"
                  }
                ],
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "HKD"
                },
                "applicationSuite": "EcoOS Core v2.5.0",
                "releaseNotes": "https://github.com/doffeycake-dev/hack2"
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://hack2-pi.vercel.app",
                "name": "EcoOS Core — Enterprise Environmental Intelligence",
                "description": "AI-powered food waste prediction and reduction platform for Hong Kong institutional food service. Forecast waste before meals are served and reduce environmental impact.",
                "datePublished": "2024-11-01",
                "dateModified": "2025-06-16",
                "author": [
                  {
                    "@type": "Organization",
                    "@id": "https://hack2-pi.vercel.app#organization"
                  },
                  {
                    "@type": "Person",
                    "@id": "https://hack2-pi.vercel.app#developer"
                  }
                ],
                "publisher": {
                  "@type": "Organization",
                  "@id": "https://hack2-pi.vercel.app#organization"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": "https://hack2-pi.vercel.app#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How does AI waste prediction work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "EcoOS uses ensemble machine learning models (Random Forest, XGBoost, Neural Network, and LLM) to forecast food waste before meals are served. The system analyzes historical waste data, menu items, attendance figures, and day-of-week patterns to predict waste quantities with up to 94.8% accuracy."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What data does EcoOS analyze?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "EcoOS analyzes historical waste records, menu compositions, attendance counts, day-of-week patterns, seasonal trends, and intervention outcomes to generate accurate waste predictions and actionable recommendations."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How accurate are the predictions?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our ensemble ML models achieve 94.8% prediction accuracy across institutional food service operations. The multi-model portfolio lets you choose from five models to best match your operational profile."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is EcoOS available for Hong Kong operations?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. EcoOS is optimized for Hong Kong institutional food service, using local waste statistics and Hong Kong Environmental Protection Department data. The platform addresses Hong Kong's 3,600 tonnes of daily food waste sent to landfills."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What models are used for waste prediction?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "EcoOS offers a five-model portfolio: Random Forest (RF), XGBoost, Neural Network (NN), Linear Regression (LR), and LLM-based prediction. Each model can be selected based on your specific accuracy and interpretability needs."
                    }
                  }
                ]
              }
            ])
          }}
        />
      </body>
    </html>
  );
}
