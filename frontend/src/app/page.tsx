import HeroScene from "@/components/3d/HeroScene";
import AboutSection from "@/components/sections/AboutSection";
import SkillsList from "@/components/sections/SkillsList";
import ProjectList from "@/components/sections/ProjectList";
import ContactForm from "@/components/sections/ContactForm";
import ResumeSection from "@/components/sections/ResumeSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <HeroScene />
      <AboutSection />
      <SkillsList />
      <ProjectList />
      <ResumeSection />
      <ContactForm />

      <footer className="py-10 text-center text-slate-500 text-sm border-t border-slate-900">
        <p>© {new Date().getFullYear()} Waheedur Rahman. Built with ❤️ Chai aur Maggie ☕</p>
      </footer>
    </main>
  );
}
