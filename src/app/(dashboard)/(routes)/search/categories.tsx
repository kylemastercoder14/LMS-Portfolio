"use client";

import { Category } from "@prisma/client";
import React from "react";
import {
  FcEngineering,
  FcFilmReel,
  FcBullish,
  FcOldTimeCamera,
  FcAutomatic,
  FcAudioFile,
  FcLightAtTheEndOfTunnel,
  FcMoneyTransfer,
  FcCustomerSupport,
  FcNeutralDecision,
  FcElectronics,
  FcBarChart,
  FcDatabase,
  FcHome,
  FcGlobe,
  FcGallery,
  FcGraduationCap,
  FcSelfie,
  FcMusic,
  FcVideoCall,
  FcIdea,
  FcCellPhone,
  FcVoicePresentation,
  FcSportsMode,
  FcManager,
  FcGenealogy,
  FcFactory,
  FcMindMap,
  FcIcons8Cup,
  FcAssistant,
} from "react-icons/fc";
import { IconType } from "react-icons";
import CategoryItem from "./category-item";

const iconMap: Record<Category["name"], IconType> = {
  Photography: FcOldTimeCamera,
  Algorithms: FcBullish,
  "3D & Animation": FcFilmReel,
  Architecture: FcEngineering,
  "Artificial Intelligence": FcAutomatic,
  "Audio Production": FcAudioFile,
  "Augmented Reality": FcLightAtTheEndOfTunnel,
  Blockchain: FcMoneyTransfer,
  "Cloud Computing": FcCustomerSupport,
  "Computer Networking": FcNeutralDecision,
  Cybersecurity: FcElectronics,
  "Data Science": FcBarChart,
  Databases: FcDatabase,
  "Mobile Development": FcCellPhone,
  "Virtual Reality": FcLightAtTheEndOfTunnel,
  DevOps: FcFactory,
  "Operating Systems": FcMindMap,
  "Music Theory": FcMusic,
  "Product Design": FcIdea,
  "Web Development": FcGlobe,
  "Motion Graphics": FcGallery,
  Singing: FcVoicePresentation,
  "Health & Fitness": FcSportsMode,
  "Software Engineering": FcEngineering,
  "Video Editing": FcVideoCall,
  "Digital Art": FcGallery,
  Instruments: FcMusic,
  "Music Production": FcAudioFile,
  "Programming Languages": FcGraduationCap,
  "Graphic Design": FcGallery,
  "Game Design": FcIcons8Cup,
  "Machine Learning": FcGenealogy,
  Lifestyle: FcHome,
  "Game Development": FcManager,
  "Fashion Design": FcSelfie,
};

const Categories = ({ items }: { items: Category[] }) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMap[category.name] || FcAssistant} // Default icon
          value={category.id}
        />
      ))}
    </div>
  );
};

export default Categories;
