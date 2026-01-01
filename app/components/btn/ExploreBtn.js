import React from 'react';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import { useI18n } from '@/app/contexts/i18n';

const ExploreBtn = ({ theme, link, iconColor, textColor, name="Explore More" }) => {
    const i18n = useI18n();
    return (
        <Link href={`/${link}`} className='flex items-center'>
            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full  ${theme === 'theme3' || theme === 'theme2' ? 'explore-btn' : 'shadow-custom-light'}`} />
            <div className={`z-10 -ml-6 lg:-ml-8 flex items-center gap-2 description-1 font-semibold`}>
            <span style={{ color: textColor }}> {i18n.t(name)}</span>
                <GoArrowRight style={{ color: iconColor }} className="text-2xl" />
            </div>
        </Link>
    );
};

export default ExploreBtn;
