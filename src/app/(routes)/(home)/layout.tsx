const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
};

export default UserLayout;
