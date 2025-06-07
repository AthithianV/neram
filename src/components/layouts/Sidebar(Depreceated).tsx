import { SIDEBAR_BODY_LINKS, SIDEBAR_FOOTER_LINKS } from '@/constants/sidebar';

const Sidebar = () => {
    return (
        <aside
            id="sidebar"
            className="text-white min-w-2/12 h-full overflow-y-auto p-2 flex flex-col justify-between border-r-2 border-gray-100"
        >
            <nav>
                <ul>
                    {SIDEBAR_BODY_LINKS.map((link, index) => (
                        <li
                            key={index}
                            className="p-2 text-black hover:bg-gray-100 rounded-md"
                        >
                            {link}
                        </li>
                    ))}
                </ul>
            </nav>

            <nav>
                <ul>
                    {SIDEBAR_FOOTER_LINKS.map((link, index) => (
                        <li
                            key={index}
                            className="p-2 text-black hover:bg-gray-100 rounded"
                        >
                            {link}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
