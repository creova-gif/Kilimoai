/**
 * LEGAL DOCUMENTS - KILIMO AI
 * 
 * Provides Privacy Policy and Terms of Service in Swahili and English.
 * Required for App Store Compliance & TRA Regulations.
 */

import React from "react";
import { Shield, Lock, FileText, ChevronLeft, Globe } from "lucide-react";
import { Button } from "./ui/button";

interface LegalDocumentsProps {
  language: "en" | "sw";
  onBack: () => void;
  type: "privacy" | "terms";
}

export function LegalDocuments({ language, onBack, type }: LegalDocumentsProps) {
  const content = {
    privacy: {
      en: {
        title: "Privacy Policy",
        lastUpdated: "Last Updated: May 2026",
        sections: [
          {
            title: "1. Data Collection",
            content: "We collect information you provide directly to us (name, phone, email) and data about your farming activities (crop types, farm location, soil data). We also collect photos uploaded for disease diagnosis."
          },
          {
            title: "2. How We Use Data",
            content: "Data is used to provide personalized agricultural advice via Sankofa AI, facilitate marketplace transactions, and generate Creova Agro ID. We use anonymized data for regional agricultural research."
          },
          {
            title: "3. Data Protection",
            content: "We comply with the Tanzania Personal Data Protection Act. Your data is encrypted and stored securely. We do not sell your personal information to third parties."
          },
          {
            title: "4. Your Rights",
            content: "You have the right to access, correct, or delete your personal data at any time via the Privacy Settings in the app."
          }
        ]
      },
      sw: {
        title: "Sera ya Faragha",
        lastUpdated: "Imesasishwa: Mei 2026",
        sections: [
          {
            title: "1. Ukusanyaji wa Data",
            content: "Tunakusanya taarifa unazotoa moja kwa moja kwetu (jina, simu, barua pepe) na data kuhusu shughuli zako za kilimo (aina za mazao, eneo la shamba, data ya udongo). Pia tunakusanya picha unazopakia kwa utambuzi wa magonjwa."
          },
          {
            title: "2. Jinsi Tunavyotumia Data",
            content: "Data hutumiwa kutoa ushauri wa kilimo kupitia Sankofa AI, kuwezesha miamala ya sokoni, na kutengeneza Creova Agro ID. Tunatumia data zisizojulikana kwa utafiti wa kilimo kikanda."
          },
          {
            title: "3. Ulinzi wa Data",
            content: "Tunazingatia Sheria ya Ulinzi wa Data Binafsi ya Tanzania. Data zako zimesimbwa na kuhifadhiwa kwa usalama. Hatuuzi taarifa zako binafsi kwa watu wa nje."
          },
          {
            title: "4. Haki Zako",
            content: "Una haki ya kufikia, kusahihisha, au kufuta data zako binafsi wakati wowote kupitia Mipangilio ya Faragha kwenye programu."
          }
        ]
      }
    },
    terms: {
      en: {
        title: "Terms of Service",
        lastUpdated: "Last Updated: May 2026",
        sections: [
          {
            title: "1. Acceptance of Terms",
            content: "By using KilimoAI, you agree to these terms. If you are using the app on behalf of a cooperative, you represent that you have authority to bind that entity."
          },
          {
            title: "2. Financial Transactions",
            content: "All mobile money transactions (M-Pesa, Airtel Money) are processed securely. KilimoAI is not responsible for errors made by mobile network providers or users during input."
          },
          {
            title: "3. AI Advisory Disclaimer",
            content: "Sankofa AI provides recommendations based on available data and TARI protocols. Farming involves inherent risks; KilimoAI is not liable for crop failure or financial loss resulting from reliance on AI advice."
          },
          {
            title: "4. User Conduct",
            content: "Users must provide accurate information for their Creova Agro ID. Fraudulent listings in the marketplace will lead to immediate account suspension."
          }
        ]
      },
      sw: {
        title: "Masharti ya Huduma",
        lastUpdated: "Imesasishwa: Mei 2026",
        sections: [
          {
            title: "1. Kukubali Masharti",
            content: "Kwa kutumia KilimoAI, unakubaliana na masharti haya. Ikiwa unatumia programu kwa niaba ya chama cha ushirika, unawakilisha kuwa una mamlaka ya kisheria kwa niaba hiyo."
          },
          {
            title: "2. Miamala ya Kifedha",
            content: "Miamala yote ya pesa mtandaoni (M-Pesa, Airtel Money) inashughulikiwa kwa usalama. KilimoAI haihusiki na makosa yanayofanywa na watoa huduma za mitandao au watumiaji wakati wa kuingiza data."
          },
          {
            title: "3. Onyo kuhusu Ushauri wa AI",
            content: "Sankofa AI inatoa mapendekezo kulingana na data zilizopo na itifaki za TARI. Kilimo kina hatari; KilimoAI haitawajibika kwa kupoteza mazao au hasara ya kifedha kutokana na kutegemea ushauri wa AI."
          },
          {
            title: "4. Maadili ya Mtumiaji",
            content: "Watumiaji lazima watoe taarifa sahihi kwa Creova Agro ID yao. Matangazo ya ulaghai sokoni yatasababisha kusitishwa kwa akaunti mara moja."
          }
        ]
      }
    }
  };

  const doc = content[type][language];

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="p-4 border-b flex items-center gap-4 sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{doc.title}</h1>
          <p className="text-xs text-gray-500">{doc.lastUpdated}</p>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-center py-4">
          <div className="p-4 bg-[#2E7D32]/5 rounded-full">
            {type === 'privacy' ? <Shield className="h-10 w-10 text-[#2E7D32]" /> : <FileText className="h-10 w-10 text-[#2E7D32]" />}
          </div>
        </div>

        {doc.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {section.content}
            </p>
          </div>
        ))}

        <div className="pt-10 border-t">
          <div className="bg-gray-50 p-4 rounded-xl space-y-2">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'Questions?' : 'Maswali?'}
            </h3>
            <p className="text-xs text-gray-600">
              {language === 'en' 
                ? "Contact our legal team at legal@kilimoai.com or visit our office in Dar es Salaam." 
                : "Wasiliana na timu yetu ya kisheria kupitia legal@kilimoai.com au tembelea ofisi zetu Dar es Salaam."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
