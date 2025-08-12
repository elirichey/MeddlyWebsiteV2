'use client';

import { useSnackbarStore } from '@/storage/stores/useSnackbarStore';
import { useEffect, useState } from 'react';

export default function Snackbar() {
	const { snackbar, setSnackbar } = useSnackbarStore();

	const show = snackbar?.show;
	const text1 = snackbar?.title;
	const text2 = snackbar?.description;
	const type = snackbar?.type;
	const duration = snackbar?.duration || 3000;
	const shouldShow = snackbar && show;

	useEffect(() => {
		if (shouldShow) {
			const timer = setTimeout(() => setSnackbar(null), duration);
			return () => clearTimeout(timer);
		}
	}, [shouldShow, duration, setSnackbar]);

	if (!shouldShow) return null;
	return (
		<div id="snackbar" data-testid="snackbar" className={`${shouldShow ? 'show' : ''} ${type}`}>
			<div id="snackbar-text1" data-testid="snackbar-text1">
				{text1}
			</div>
			{text2 !== undefined && (
				<div id="snackbar-text2" data-testid="snackbar-text2">
					{text2}
				</div>
			)}
		</div>
	);
}

// Simple hook for easy snackbar triggering
export const useSnackbar = () => {
	const [snackbar, setSnackbar] = useState<{
		show: boolean;
		text1: string;
		text2: string;
		type: 'success' | 'error' | 'warning' | 'general';
		duration: number;
	}>({ show: false, text1: '', text2: '', type: 'general', duration: 3000 });

	const showSnackbar = (
		text1: string,
		text2?: string,
		type?: 'success' | 'error' | 'warning' | 'general',
		duration?: number,
	) => {
		setSnackbar({
			show: true,
			text1,
			text2: text2 || '',
			type: type || 'general',
			duration: duration || 3000,
		});
	};

	const hideSnackbar = () => {
		setSnackbar((prev) => ({
			...prev,
			show: false,
		}));
	};

	return {
		snackbar,
		showSnackbar,
		hideSnackbar,
	};
};

/*
 * USAGE EXAMPLES
 * ==============
 *
 * Example 1: Using the Snackbar component directly
 * ----------------------------------------------
 *
 * import Snackbar from './components/Notifications/Snackbar';
 *
 * function MyComponent() {
 *   const [showSnackbar, setShowSnackbar] = useState(false);
 *
 *   const handleShowSnackbar = () => {
 *     setShowSnackbar(true);
 *   };
 *
 *   const handleCloseSnackbar = () => {
 *     setShowSnackbar(false);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleShowSnackbar}>
 *         Show Success Message
 *       </button>
 *
 *       <Snackbar
 *         text1="Success!"
 *         text2="Your action was completed successfully."
 *         show={showSnackbar}
 *         onClose={handleCloseSnackbar}
 *         duration={5000} // Optional: custom duration in milliseconds
 *       />
 *     </div>
 *   );
 * }
 *
 *
 * Example 2: Using the useSnackbar hook (Recommended)
 * --------------------------------------------------
 *
 * import Snackbar, { useSnackbar } from './components/Notifications/Snackbar';
 *
 * function MyComponent() {
 *   const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
 *
 *   const handleSuccess = () => {
 *     showSnackbar('Success!', 'Your action was completed successfully.', 5000);
 *   };
 *
 *   const handleError = () => {
 *     showSnackbar('Error!', 'Something went wrong. Please try again.', 4000);
 *   };
 *
 *   const handleSimpleMessage = () => {
 *     showSnackbar('Simple notification message'); // Uses default duration (3000ms)
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleSuccess}>Show Success</button>
 *       <button onClick={handleError}>Show Error</button>
 *       <button onClick={handleSimpleMessage}>Show Simple Message</button>
 *
 *       <Snackbar
 *         text1={snackbar.text1}
 *         text2={snackbar.text2}
 *         show={snackbar.show}
 *         onClose={hideSnackbar}
 *         duration={snackbar.duration}
 *       />
 *     </div>
 *   );
 * }
 *
 *
 * Example 3: Integration with form submission
 * ------------------------------------------
 *
 * function ContactForm() {
 *   const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
 *   const [isSubmitting, setIsSubmitting] = useState(false);
 *
 *   const handleSubmit = async (formData) => {
 *     setIsSubmitting(true);
 *
 *     try {
 *       await submitForm(formData);
 *       showSnackbar('Form Submitted!', 'Thank you for your message. We\'ll get back to you soon.');
 *     } catch (error) {
 *       showSnackbar('Submission Failed', 'There was an error submitting your form. Please try again.');
 *     } finally {
 *       setIsSubmitting(false);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <form onSubmit={handleSubmit}>
 *         {/* form fields *}
 *         <button type="submit" disabled={isSubmitting}>
 *           {isSubmitting ? 'Submitting...' : 'Submit'}
 *         </button>
 *       </form>
 *
 *       <Snackbar
 *         text1={snackbar.text1}
 *         text2={snackbar.text2}
 *         show={snackbar.show}
 *         onClose={hideSnackbar}
 *         duration={snackbar.duration}
 *       />
 *     </div>
 *   );
 * }
 *
 *
 * CSS Requirements:
 * ----------------
 * Make sure you have the following CSS for the snackbar to display properly:
 *
 * #snackbar {
 *   visibility: hidden;
 *   min-width: 250px;
 *   margin-left: -125px;
 *   background-color: #333;
 *   color: #fff;
 *   text-align: center;
 *   border-radius: 2px;
 *   padding: 16px;
 *   position: fixed;
 *   z-index: 1;
 *   left: 50%;
 *   bottom: 30px;
 * }
 *
 * #snackbar.show {
 *   visibility: visible;
 *   animation: fadein 0.5s, fadeout 0.5s 2.5s;
 * }
 *
 * @keyframes fadein {
 *   from {bottom: 0; opacity: 0;}
 *   to {bottom: 30px; opacity: 1;}
 * }
 *
 * @keyframes fadeout {
 *   from {bottom: 30px; opacity: 1;}
 *   to {bottom: 0; opacity: 0;}
 * }
 */
