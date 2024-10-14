
// Sample dataset
const dataset = [
    { arrival_date_year: 2024, arrival_date_month: 'January', arrival_date_day_of_month: 1, adults: 2, children: 1, babies: 0, country: 'USA' },
    { arrival_date_year: 2024, arrival_date_month: 'January', arrival_date_day_of_month: 1, adults: 1, children: 0, babies: 1, country: 'Canada' },
    { arrival_date_year: 2024, arrival_date_month: 'January', arrival_date_day_of_month: 2, adults: 2, children: 0, babies: 0, country: 'USA' },
    { arrival_date_year: 2024, arrival_date_month: 'January', arrival_date_day_of_month: 2, adults: 1, children: 2, babies: 0, country: 'Mexico' },
    { arrival_date_year: 2024, arrival_date_month: 'February', arrival_date_day_of_month: 1, adults: 1, children: 1, babies: 0, country: 'UK' },
    { arrival_date_year: 2024, arrival_date_month: 'February', arrival_date_day_of_month: 1, adults: 2, children: 0, babies: 0, country: 'Germany' },
    { arrival_date_year: 2024, arrival_date_month: 'February', arrival_date_day_of_month: 2, adults: 3, children: 1, babies: 0, country: 'USA' },
    // Add more records to reach 1000 if necessary
];

$(document).ready(function() {
    $('#filterBtn').on('click', function() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const filteredData = filterData(startDate, endDate);
        renderCharts(filteredData);
    });
    
    // Initialize with full dataset
    renderCharts(dataset);
});

function filterData(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return dataset.filter(entry => {
        const entryDate = new Date(entry.arrival_date_year, new Date(entry.arrival_date_month + ' 1').getMonth(), entry.arrival_date_day_of_month);
        return entryDate >= start && entryDate <= end;
    });
}

function renderCharts(data) {
    // Time Series Chart
    const visitorsPerDay = data.reduce((acc, entry) => {
        const dateKey = \`\${entry.arrival_date_year}-\${entry.arrival_date_month}-\${entry.arrival_date_day_of_month}\`;
        if (!acc[dateKey]) acc[dateKey] = { total: 0 };
        acc[dateKey].total += entry.adults + entry.children + entry.babies;
        return acc;
    }, {});

    const timeSeriesData = Object.keys(visitorsPerDay).map(date => {
        return { x: new Date(date), y: visitorsPerDay[date].total };
    });

    const timeSeriesOptions = {
        chart: { type: 'line' },
        series: [{ name: 'Total Visitors', data: timeSeriesData }],
        xaxis: { type: 'datetime' },
    };
    new ApexCharts(document.querySelector("#chart1"), timeSeriesOptions).render();

    // Column Chart
    const visitorsPerCountry = data.reduce((acc, entry) => {
        acc[entry.country] = (acc[entry.country] || 0) + entry.adults + entry.children + entry.babies;
        return acc;
    }, {});

    const columnData = Object.keys(visitorsPerCountry).map(country => {
        return { x: country, y: visitorsPerCountry[country] };
    });

    const columnOptions = {
        chart: { type: 'bar' },
        series: [{ name: 'Visitors', data: columnData }],
    };
    new ApexCharts(document.querySelector("#chart2"), columnOptions).render();

    // Sparkline for Adult Visitors
    const adultVisitorsData = data.map(entry => entry.adults);
    const adultSparklineOptions = {
        chart: { type: 'line', sparkline: { enabled: true } },
        series: [{ name: 'Adult Visitors', data: adultVisitorsData }],
    };
    new ApexCharts(document.querySelector("#sparkline1"), adultSparklineOptions).render();

    // Sparkline for Children Visitors
    const childrenVisitorsData = data.map(entry => entry.children);
    const childrenSparklineOptions = {
        chart: { type: 'line', sparkline: { enabled: true } },
        series: [{ name: 'Children Visitors', data: childrenVisitorsData }],
    };
    new ApexCharts(document.querySelector("#sparkline2"), childrenSparklineOptions).render();
}
