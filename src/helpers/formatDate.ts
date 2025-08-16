export function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = date.getMonth();
    const monthNum = String(monthIndex + 1).padStart(2, "0");
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();

    const showYear = year !== currentYear;

    const formattedDate = showYear
        ? `${day}/${monthNum}/${year}`
        : `${day}/${monthNum}`;

    return formattedDate;
}