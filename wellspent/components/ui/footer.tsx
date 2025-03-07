export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-16 items-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} WellSpent. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 