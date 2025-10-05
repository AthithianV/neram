import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ABOUT_BUTTONS } from '@/constants/about';
import { Button } from '../ui/button';
import aakkamLogo from '../../../public/akkam-logo.png';
import { CircleUserRoundIcon } from 'lucide-react';

export function AboutModal() {
    return (
        <Dialog>
            <DialogTrigger
                className="
                w-full
                flex items-center gap-2 p-2 px-4 text-sm
                rounded-[5px] cursor-pointer
                bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600
                text-white font-semibold
                shadow-sm shadow-teal-400/50
                transition-all duration-300 ease-in-out
                hover:scale-102 hover:shadow-md hover:from-teal-500 hover:via-teal-600 hover:to-teal-500
                active:scale-95
              "
            >
                <CircleUserRoundIcon size={18} /> About
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-full bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white rounded-2xl shadow-xl">
                {/* Header */}
                <DialogHeader className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                        <AvatarImage src={aakkamLogo} alt="Athithian" />
                        <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl font-bold mb-2">
                        Hi, I’m Athithian 👋
                    </DialogTitle>
                    <p className="text-sm mb-4 text-justify">
                        I’m a passionate developer building <b>Neram</b>, a
                        modern productivity app. I love coding, learning, and
                        helping others build amazing software.
                    </p>
                </DialogHeader>

                {/* Links */}
                <div className="flex justify-center gap-2 mb-6">
                    {ABOUT_BUTTONS.map((item) => (
                        <Button
                            key={item.link}
                            variant={'ghost'}
                            onClick={() => open(item.link)}
                            className="flex items-center justify-center px-1 hover:bg-transparent"
                        >
                            <a href={item.link} target="_blank">
                                {item.icon}
                            </a>
                        </Button>
                    ))}
                </div>
                {/* Footer */}
                <DialogFooter className="text-center text-xs text-white/80">
                    Made with ❤️ using<b>Tauri & React</b>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
