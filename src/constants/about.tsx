export const GITHUB_LINK = 'https://github.com/AthithianV';
export const LINKEDIN_LINK = 'https://www.linkedin.com/in/athithianv/';
export const BUY_ME_COFFEE_LINK = 'https://buymeacoffee.com/athithianv';
export const PRODUCT_HUNT_LINK = 'https://www.producthunt.com/products/neram';
export const PRODUCT_HUNT_REVIEW_LINK =
    'https://www.producthunt.com/products/neram/reviews/new';
export const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=OOJF6Q_iO10';

export const ABOUT_BUTTONS = [
    {
        title: 'Github',
        icon: (
            <div>
                <img
                    src={'/github-mark-white.png'}
                    alt=""
                    height={30}
                    width={30}
                />
            </div>
        ),
        link: GITHUB_LINK,
    },
    {
        title: 'Linkedin',
        icon: (
            <div>
                <img src={'/linkedin.png'} alt="" height={35} width={35} />
            </div>
        ),
        link: LINKEDIN_LINK,
    },
    {
        title: 'Product Hunt',
        icon: (
            <div>
                <img
                    src={'/product-hunt-logo.png'}
                    alt=""
                    height={35}
                    width={35}
                />
            </div>
        ),
        link: PRODUCT_HUNT_LINK,
    },
    {
        title: 'Youtube',
        icon: (
            <div>
                <img src={'/youtube-logo.png'} alt="" height={35} width={35} />
            </div>
        ),
        link: YOUTUBE_LINK,
    },
    {
        title: 'Donate',
        icon: (
            <div>
                <img src={'/donate.png'} alt="" height={35} width={35} />
            </div>
        ),
        link: BUY_ME_COFFEE_LINK,
    },
];
