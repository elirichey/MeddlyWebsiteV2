import ChevronDoubleLeft from '../Icons/ChevronDoubleLeft';
import ChevronDoubleRight from '../Icons/ChevronDoubleRight';
import ChevronLeft from '../Icons/ChevronLeft';
import ChevronRight from '../Icons/ChevronRight';

interface Props {
	currentPage: number;
	goNext: () => void;
	goPrevious: () => void;
	goToPage: (page: number) => void;
	goFirst: () => void;
	goLast: () => void;
	totalPages: number;
}

export default function Pagination(props: Props) {
	const { currentPage, goNext, goPrevious, goToPage, goFirst, goLast, totalPages } = props;

	const renderPreviousButtons = () => {
		return (
			<>
				{currentPage < 5 ? null : (
					<button type="button" onClick={() => goToPage(currentPage - 3)}>
						{currentPage - 4}
					</button>
				)}

				{currentPage < 4 ? null : (
					<button type="button" onClick={() => goToPage(currentPage - 3)}>
						{currentPage - 3}
					</button>
				)}

				{currentPage < 3 ? null : (
					<button type="button" onClick={() => goToPage(currentPage - 2)}>
						{currentPage - 2}
					</button>
				)}

				{currentPage < 2 ? null : (
					<button type="button" onClick={() => goToPage(currentPage - 1)}>
						{currentPage - 1}
					</button>
				)}
			</>
		);
	};

	const renderNextButtons = () => {
		return (
			<>
				{currentPage <= totalPages - 1 ? (
					<button type="button" onClick={() => goToPage(currentPage + 1)}>
						{currentPage + 1}
					</button>
				) : null}

				{currentPage < totalPages - 2 ? (
					<button type="button" onClick={() => goToPage(currentPage + 2)}>
						{currentPage + 2}
					</button>
				) : null}

				{currentPage < totalPages - 3 ? (
					<button type="button" onClick={() => goToPage(currentPage + 3)}>
						{currentPage + 3}
					</button>
				) : null}
			</>
		);
	};

	return (
		<div id="pagination">
			{/* PREVIOUS */}
			{currentPage > 5 ? (
				<button type="button" onClick={goFirst}>
					<ChevronDoubleLeft className="pagination-arrow" />
				</button>
			) : null}

			{currentPage > 1 && currentPage > 5 ? (
				<button type="button" onClick={goPrevious}>
					<ChevronLeft className="pagination-arrow" />
				</button>
			) : null}

			{/* CURRENT */}
			{renderPreviousButtons()}
			<button type="button" disabled={true} className="current-page">
				{currentPage}
			</button>
			{renderNextButtons()}

			{/* NEXT */}
			{currentPage < totalPages && currentPage < totalPages ? (
				<button type="button" onClick={goNext}>
					<ChevronRight className="pagination-arrow" />
				</button>
			) : null}

			{currentPage < totalPages && currentPage < totalPages ? (
				<button type="button" onClick={goLast}>
					<ChevronDoubleRight className="pagination-arrow" />
				</button>
			) : null}
		</div>
	);
}
