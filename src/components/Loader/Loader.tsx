import dynamic from 'next/dynamic';
import * as circleEq from './lottie/circle-eq.json';
import * as circleEqWhite from './lottie/circle-eq-white.json';
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

// Helper function to create a deep copy of JSON data
const createDeepCopy = (data: any): any => {
	return JSON.parse(JSON.stringify(data));
};

export default function Loader(props: Props) {
	const { loaderId } = props;

	const returnLoader = (id: string) => {
		switch (id) {
			case 'circle-eq':
				return createDeepCopy(circleEq);
			case 'circle-eq-white':
				return createDeepCopy(circleEqWhite);
			case 'light-sound-waves':
				return createDeepCopy(lightSoundWaves);
			case 'dark-sound-waves':
				return createDeepCopy(darkSoundWaves);
			case 'colored-dots':
				return createDeepCopy(coloredDots);
			case 'mono-colored-horizontal-eq':
				return createDeepCopy(monoColorHorizontalEq);
			default:
				return createDeepCopy(monoColorHorizontalEq);
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
	return null;
}
