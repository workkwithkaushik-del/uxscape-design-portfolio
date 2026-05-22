export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-serif text-4xl leading-tight">Let's design<br/>something quieter,<br/><em className="text-accent">but louder in impact.</em></h3>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground uppercase tracking-widest text-xs">Elsewhere</p>
          <a href="https://www.linkedin.com/in/kaushik-patil02" className="block hover:text-accent transition-colors">LinkedIn ↗</a>
          <a href="mailto:workkwithkaushik@gmail.com" className="block hover:text-accent transition-colors">Email ↗</a>
          <a href="https://drive.google.com/file/d/1qP2-igDcgKLjXxieGpsVmuL_UnF3jRFK/view?usp=sharing" className="block hover:text-accent transition-colors">Résumé ↗</a>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground uppercase tracking-widest text-xs">Currently</p>
          <p>Pune, IN · open to product design roles</p>
          <p className="text-muted-foreground">© {new Date().getFullYear()} Kaushik Patil. Hand-built, not templated.</p>
        </div>
      </div>
    </footer>
  );
}
