import dynamic from 'next/dynamic';
import * as circleEqWhite from './lottie/circle-eq-white.json';
import * as circleEq from './lottie/circle-eq.json';
import * as coloredDots from './lottie/colored-dots.json';
import * as darkSoundWaves from './lottie/dark-sound-waves.json';
import * as lightSoundWaves from './lottie/light-text-sound-waves.json';
import * as monoColorHorizontalEq from './lottie/mono-color-horizontal-eq.json';
const Lottie: any = dynamic((): Promise<any> => import('react-lottie'), {
	ssr: false,
});

interface Props {
	loaderId:
		| 'circle-eq'
		| 'circle-eq-white'
		| 'light-sound-waves'
		| 'dark-sound-waves'
		| 'colored-dots'
		| 'mono-colored-horizontal-eq';
}
export default function Loader(props: Props) {
	const { loaderId } = props;

	const returnLoader = (id: string) => {
		switch (id) {
			case 'circle-eq':
				return circleEq;
			case 'circle-eq-white':
				return circleEqWhite;
			case 'light-sound-waves':
				return lightSoundWaves;
			case 'dark-sound-waves':
				return darkSoundWaves;
			case 'colored-dots':
				return coloredDots;
			case 'mono-colored-horizontal-eq':
				return monoColorHorizontalEq;
			default:
				return monoColorHorizontalEq;
		}
	};

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: returnLoader(loaderId),
		rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
	};

	if (typeof navigator !== 'undefined') {
		return <Lottie options={defaultOptions} />;
	}
	return <div />;
}
