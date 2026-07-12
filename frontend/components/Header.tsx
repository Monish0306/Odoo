'use client';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-[#2E4F66] mb-2" style={{ fontFamily: 'Sentient, serif' }}>
        {title}
      </h1>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  );
};

export default Header;
