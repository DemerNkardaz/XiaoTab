/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '@/assets/*.svg' {
	import { FunctionalComponent, SVGAttributes } from 'vue';
	const src: FunctionalComponent<SVGAttributes>;
	export default src;
}
