export function DecorativeBackground() {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[500px] w-full bg-gradient-to-b from-primary/10 via-primary/5 to-background z-0 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-blue-400/10 blur-[100px] rounded-full z-0 pointer-events-none" />
    </>
  );
}
