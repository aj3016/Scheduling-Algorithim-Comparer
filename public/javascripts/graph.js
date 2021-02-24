var chrt = document.getElementById('mycanvas').getContext('2d');
var wt = []; var tat=[];

for(i=0;i<6;i++){
    wt[i] = parseFloat($(`#wt${i}`).text());
}
console.log(wt);

for(i=0;i<6;i++){
    tat[i] = parseFloat($(`#tat${i}`).text());
}
console.log(tat);

var myChart = new Chart(chrt, {
    type: 'bar',
    data: {
        labels: ['FCFS', 'Round Robin', 'PRS (Preemptive)', 'PRS (Non Preemptive)', 'SJF', 'SRTF'],
        datasets: [{
            label: 'Average Waiting Time',
            data: wt,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },{
            label: 'Average Turnaround Time',
            data: tat,
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    fontSize: 13,
                    labelString	: "Time (sec)"
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    fontSize: 13,
                    labelString	: "Scheduling Algorithms"
                }
            }]
        }
    }
});