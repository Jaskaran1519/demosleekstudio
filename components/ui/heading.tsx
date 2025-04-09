interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm md:text-base lg:text-lg text-muted-foreground">{description}</p>
    </div>
  );
}; 