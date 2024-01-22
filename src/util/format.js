export function formatDate(date) {
	if (!date) return '';

	const formattedDate = new Date(date).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
	return formattedDate;
}
