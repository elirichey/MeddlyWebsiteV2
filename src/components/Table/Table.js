import { useExpanded, useSortBy, useTable } from 'react-table';

export default function Table(props) {
	const { id, data, columns, loading, actions } = props;

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{ columns, data },
		useSortBy,
		useExpanded,
	);

	return (
		<table id={id} {...getTableProps()} className="dashboard-table">
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => {
							const { id } = column;
							const className = id
								.split('')
								.map((letter, idx) => {
									return letter.toUpperCase() === letter ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}` : letter;
								})
								.join('');

							return (
								<th className={className} {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render('Header')}
									<span>
										{column.isSorted ? (
											column.isSortedDesc ? (
												<span className="sort desc">«</span>
											) : (
												<span className="sort asc">«</span>
											)
										) : (
											<span className="sort" />
										)}
									</span>
								</th>
							);
						})}
					</tr>
				))}
			</thead>

			<tbody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row);

					return (
						<tr
							{...row.getRowProps()}
							onClick={actions && actions.clickRow ? () => actions.clickRow(row.original) : null}
							className={i % 2 === 0 ? 'even' : 'odd'}
							key={i}
						>
							{row.cells.map((cell) => {
								const string = cell.column.Header.toLowerCase();
								const className = string.split(' ').join('-');
								const cellProps = { ...cell.getCellProps() };

								const activeCol = string === 'active';

								return (
									<td
										{...cellProps}
										className={className}
										onClick={
											activeCol
												? null
												: // : actions && actions.clickCell
													// ? () => actions.clickCell(row.original)
													null
										}
									>
										{cell.render('Cell')}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
