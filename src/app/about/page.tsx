import { Metadata } from "next";
import { BookOpen, Target, Users, Shield, Sword, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About SSD | Samta Sainik Dal Delhi",
  description: "Learn about Samta Sainik Dal Delhi - founded by Dr. B.R. Ambedkar in 1924. Understanding our ideology, mission, and organizational structure.",
};

const ideologyPoints = [
  {
    icon: Target,
    title: "Annihilation of Caste",
    description: "Complete eradication of the caste system and all social hierarchies that divide humanity",
  },
  {
    icon: Users,
    title: "Equality",
    description: "Establishment of equality based on race, religion, caste, sex, and class",
  },
  {
    icon: Shield,
    title: "Non-Violent Resistance",
    description: "Peaceful protest with self-respect and self-defense against oppression",
  },
  {
    icon: Heart,
    title: "Service",
    description: "Dedicated service to workers, laborers, Dalits, exploited, and poor people",
  },
  {
    icon: BookOpen,
    title: "Education",
    description: "Promoting education and awareness as tools for social transformation",
  },
  {
    icon: Sword,
    title: "Social Justice",
    description: "Fighting for the rights and dignity of marginalized communities",
  },
];

const structureLevels = [
  { level: "National", title: "Supreme Commander-in-Chief", description: "National leadership and strategic direction" },
  { level: "Zonal/State", title: "Major-General / GOC", description: "State-level coordination and oversight" },
  { level: "Division/District", title: "Divisional Officers", description: "District-level management" },
  { level: "Battalion/City", title: "Battalion Commanders", description: "City-level operations (Delhi unit)" },
  { level: "Company/Block", title: "Company Officers", description: "Block-level coordination" },
  { level: "Platoon/Village", title: "Local Unit Leaders", description: "Grassroots organization" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              About <span className="text-[#FFDA78]">Samta Sainik Dal</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 font-bold tracking-widest uppercase">
              समता सैनिक दल — Soldiers for Equality
            </p>
            <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed font-medium">
              Samta Sainik Dal (SSD) is a volunteer force founded by Bodhisattva Dr. B.R. Ambedkar to defend
              the rights and dignity of India&apos;s oppressed communities and build a casteless, egalitarian society.
            </p>
          </div>
        </div>
      </section>

      {/* Organization Overview */}
      <section id="organization" className="py-24 bg-white dark:bg-slate-950 relative z-20 -mt-12 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-[#003285] tracking-tight">Organization <span className="text-[#FF7F3E]">Overview</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Rooted in Ambedkarite values, SSD trains disciplined social volunteers who protect
                movements, spread awareness, and stand in non-violent resistance against caste-based
                discrimination and injustice.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="h-1 w-20 bg-[#FF7F3E] rounded-full" />
                <div className="h-1 w-8 bg-[#2A629A] rounded-full" />
              </div>
            </div>
            <div className="grid gap-6 grid-cols-2">
              <div className="p-8 bg-slate-50 rounded-[32px] border-b-4 border-[#003285]">
                <div className="text-xs text-[#2A629A] font-black uppercase tracking-widest mb-2">Founded</div>
                <div className="text-4xl font-black text-[#003285]">1924</div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border-b-4 border-[#FF7F3E]">
                <div className="text-xs text-[#2A629A] font-black uppercase tracking-widest mb-2">Units</div>
                <div className="text-4xl font-black text-[#003285]">India</div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border-b-4 border-[#2A629A] col-span-2">
                <div className="text-xs text-[#2A629A] font-black uppercase tracking-widest mb-2">Founder Mission</div>
                <div className="text-2xl font-black text-[#003285]">Casteless Society</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ideology */}
      <section id="ideology" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#003285] mb-4">Core <span className="text-[#FF7F3E]">Ideology</span></h2>
            <p className="text-[#2A629A] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              Our principles are rooted in the teachings of Dr. B.R. Ambedkar and the Buddhist path of compassion and justice.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ideologyPoints.map((point) => (
              <div key={point.title} className="p-10 bg-white dark:bg-slate-950 rounded-[40px] shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group">
                <point.icon className="h-12 w-12 text-[#FF7F3E] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-[#003285] mb-4">{point.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section id="structure" className="py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#003285] mb-4">Organizational <span className="text-[#2A629A]">Structure</span></h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              SSD follows a quasi-military hierarchical structure for effective coordination and disciplined action.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {structureLevels.map((item, index) => (
              <div key={item.level} className="relative group">
                <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[40px] border-l-8 border-[#003285] hover:border-[#FF7F3E] transition-all duration-300">
                  <div className="text-xs text-[#2A629A] font-black uppercase tracking-[0.2em] mb-3">
                    Level {index + 1} • {item.level}
                  </div>
                  <h3 className="text-2xl font-bold text-[#003285] mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Ambedkar Section */}
      <section id="ambedkar" className="py-24 bg-[#003285] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FFDA78]/10 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight">Dr. <span className="text-[#FFDA78]">B.R. Ambedkar</span></h2>
              <div className="space-y-4">
                <p className="text-xl text-blue-100/90 leading-relaxed font-medium">
                  Bhimrao Ramji Ambedkar (1891-1956) was an Indian jurist, economist, politician, and
                  social reformer who inspired the Dalit Buddhist movement and campaigned against
                  social discrimination towards Dalits.
                </p>
                <p className="text-blue-200/80 leading-relaxed">
                  The principal architect of the Indian Constitution and the first Law Minister of independent India.
                  He founded Samta Sainik Dal to create a disciplined volunteer force for social transformation.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Architect of Constitution",
                  "Champion of Rights",
                  "Women's Empowerment",
                  "Advocate of Education"
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm font-bold text-blue-100">
                    <div className="h-5 w-5 rounded-full bg-[#FF7F3E] flex items-center justify-center">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF7F3E] to-[#FFDA78] rounded-[60px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative aspect-[3/4] w-full max-w-sm bg-white rounded-[48px] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-12 text-center">
                  <div className="text-8xl mb-8">📜</div>
                  <h3 className="text-3xl font-black text-[#003285] mb-2">Babasaheb</h3>
                  <p className="text-[#2A629A] font-bold tracking-[0.3em] uppercase text-xs mb-6">1891 - 1956</p>
                  <div className="h-px w-12 bg-[#FF7F3E] mb-6" />
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    Founder & Supreme Commander<br />
                    Samta Sainik Dal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-12 bg-[#003285] text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Shield className="h-32 w-32" />
              </div>
              <h3 className="text-3xl font-black mb-6">Vision</h3>
              <p className="text-xl text-blue-100/90 leading-relaxed font-medium relative z-10">
                A casteless, democratic, humane India where every human being enjoys equal rights,
                self‑respect and dignity, free from all forms of discrimination.
              </p>
            </div>
            <div className="p-12 bg-[#FF7F3E] text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Target className="h-32 w-32" />
              </div>
              <h3 className="text-3xl font-black mb-6">Mission</h3>
              <p className="text-xl text-white leading-relaxed font-medium relative z-10">
                To organize and train volunteers as “soldiers for equality” who educate, mobilize and
                protect oppressed communities; resist injustice through disciplined, non‑violent struggle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
