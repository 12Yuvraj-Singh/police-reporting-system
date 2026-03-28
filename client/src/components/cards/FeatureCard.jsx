import React from "react";
import { Link } from "react-router-dom";

export default function FeatureCard({ title, icon, subtitle = "", link = "#" }) {
  return (
    <Link to={link} className="block p-6 rounded-2xl glass shadow-md smooth hover:-translate-y-1 hover:shadow-2xl">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-sm text-gray-300 mt-2">{subtitle}</div>
    </Link>
  );
}
