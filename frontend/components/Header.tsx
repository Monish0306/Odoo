'use client';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-10">
      <h1 className="text-5xl font-bold text-[#2E4F66] mb-3 tracking-tight" style={{ fontFamily: 'Sentient, serif' }}>
        {title}
      </h1>
      <p className="text-gray-500 text-base font-normal">{subtitle}</p>
    </div>
  );
};

export default Header;
