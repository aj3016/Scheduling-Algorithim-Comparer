var express = require('express');
var router = express.Router();
var index = require('./index');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  /****************************************************************************************************************/
   
  var fcfs = []; var compl_time=[];
  fcfs=findavgTimeForFCFS(index.id, index.n-1, index.bt, index.at);
  for (var i = 0 ; i < (index.n)-1 ; i++)
	{
		compl_time [i]= fcfs[4][i] + fcfs[2][i];
    	//console.log(fcfs[0], fcfs[1], fcfs[2], fcfs[3][i], fcfs[4][i], compl_time[i]);
    }
  /****************************************************************************************************************/
  var rr=[];
  rr=findavgTimeForRR(index.id, index.n-1, index.bt, index.quantum, index.at);
  /****************************************************************************************************************/
   var priosche = [];
   priosche=findavgTimeForPrioSchePre(index.id,index.n-1,index.bt,index.prio,index.at);  
  /****************************************************************************************************************/
   var prioschenp = []
   prioschenp=findavgTimeForPrioScheNoPre(index.id,index.n-1,index.bt,index.prio,index.at);
  /****************************************************************************************************************/
   var sjf=[];
   sjf=findavgTimeForSJF(index.id, index.n-1, index.bt, index.at);
  /****************************************************************************************************************/
	var srtf=[];
	srtf=findavgTimeForSRTF(index.id, index.n-1, index.bt, index.at);
  /****************************************************************************************************************/

  res.render('tabs',{id:index.id, bt:index.bt, at:index.at, wt1:fcfs[3], tat1:fcfs[4], compl_time1:compl_time, total_tat1:fcfs[5], total_wt1:fcfs[6], avg_tat1:fcfs[7], avg_wt1:fcfs[8], n:index.n-1, quantum:index.quantum, proc_obj:rr[0], total_tat2:rr[1], total_wt2:rr[2], avg_tat2:rr[3], avg_wt2:rr[4], prio:index.prio,wt3:priosche[0], tat3:priosche[1], total_tat3:priosche[3], total_wt3:priosche[2], avg_tat3:priosche[5], avg_wt3:priosche[4], compl_time3:priosche[6],wt4:prioschenp[0], tat4:prioschenp[1], total_tat4:prioschenp[3], total_wt4:prioschenp[2], avg_tat4:prioschenp[5], avg_wt4:prioschenp[4], compl_time4:prioschenp[6],wt5:sjf[0], tat5:sjf[1], total_tat5:sjf[3], total_wt5:sjf[2], avg_tat5:sjf[5], avg_wt5:sjf[4], compl_time5:sjf[6],wt6:srtf[0], tat6:srtf[1], total_tat6:srtf[3], total_wt6:srtf[2], avg_tat6:srtf[5], avg_wt6:srtf[4], compl_time6:srtf[6],pid:fcfs[0],reat:fcfs[2],rebt:fcfs[1]});
});

/****************************************************************************************************************/
function findWaitingTimeForFCFS ( processes, n,  bt, wt, at)
{
	var service_time=[];
	service_time[0] = 0;
	wt[0] = 0;

	for (var i = 1; i < n ; i++)
	{
		service_time[i] = service_time[i-1] + bt[i-1];

		wt[i] = service_time[i] - at[i];

		if (wt[i] < 0){
			wt[i] = 0;
			service_time[i]= service_time[i]+1
		}
	}
}

function findTurnAroundTimeForFCFS(processes, n, bt, wt, tat)
{
	//console.log(bt, wt);
	for (var i = 0; i < n ; i++)
		tat[i] = bt[i] + wt[i];
}

function findavgTimeForFCFS(processes, n, bt, at)
{
	var wt=[], tat=[]; var temp =[]; repid=[]; rebt=[]; reat=[];

	for(var i=0;i<n;i++){
		var proc = {
			pid : processes[i],
			bt : bt[i],
			at : at[i]
		}
		temp.push(proc)
	}

	temp.sort(function(a,b){return a.at-b.at});

	for(var i=0; i<n; i++ ){
		repid[i]=temp[i].pid;
		rebt[i]=temp[i].bt;
		reat[i]=temp[i].at;
	}

	findWaitingTimeForFCFS(repid, n, rebt, wt, reat);
	findTurnAroundTimeForFCFS(repid, n, rebt, wt, tat);
	
	var total_wt = 0, total_tat = 0;
	for (var i = 0 ; i < n ; i++)
	{
		total_wt = total_wt + wt[i];
		total_tat = total_tat + tat[i];
	}

  var avg_wt = parseFloat(total_wt)/parseFloat(n);
  var avg_tat = parseFloat(total_tat)/parseFloat(n);

  return[repid,rebt,reat,wt,tat,total_tat,total_wt,avg_tat,avg_wt];
}

/****************************************************************************************************************/

function findavgTimeForRR(pid,n,bt,quantum,at){
    
    var proc = [], temp;
    for(var i=0;i<n;i++){
        temp={
            pid : pid[i],
            arrival_time: at[i],
            burst_time: bt[i],
            start_time : 0, 
            completion_time : 0, 
            turnaround_time : 0 , 
            waiting_time : 0
        }
        proc.push(temp);
    }

    var avg_turnaround_time;
    var avg_waiting_time;
  
    var total_turnaround_time = 0;
    var total_waiting_time = 0;
    var burst_remaining=[];

    for(var i=0;i<n;i++){
        burst_remaining[i]=proc[i].burst_time;
    }
    var idx;

   
    proc.sort(function(a,b){return a.arrival_time - b.arrival_time;});

    var q = [];
    var current_time = 0;
    q.push(0);
    var completed = 0;
    var mark = [];
    for(var i=0; i<n; i++){
      mark[i]=0;
    }
    mark[0] = 1;

    while(completed != n) {
        idx = q.shift();
        if(burst_remaining[idx] === proc[idx].burst_time) {
            proc[idx].start_time = Math.max(current_time,proc[idx].arrival_time);
            current_time = proc[idx].start_time;
        }

        if(burst_remaining[idx]-quantum > 0) {
            burst_remaining[idx] -= quantum;
            current_time += quantum;
        }
        else {
            current_time += burst_remaining[idx];
            burst_remaining[idx] = 0;
            completed++;

            proc[idx].completion_time = current_time;
            proc[idx].turnaround_time = proc[idx].completion_time - proc[idx].arrival_time;
            proc[idx].waiting_time = proc[idx].turnaround_time - proc[idx].burst_time;

            total_turnaround_time += proc[idx].turnaround_time;
            total_waiting_time += proc[idx].waiting_time;
        }

        for(var i = 1; i < n; i++) {
            if(burst_remaining[i] > 0 && proc[i].arrival_time <= current_time && mark[i] == 0) {
                q.push(i);
                mark[i] = 1;
            }
        }
        if(burst_remaining[idx] > 0) {
            q.push(idx);
        }

        if(q.length==0) {
            for(var i = 1; i < n; i++) {
                if(burst_remaining[i] > 0) {
                    q.push(i);
                    mark[i] = 1;
                    break;
                }
            }
        }


    }

    var avg_waiting_time = parseFloat(total_waiting_time)/parseFloat(n);
    var avg_turnaround_time = parseFloat(total_turnaround_time)/parseFloat(n);

    proc.sort(function(a,b){return a.pid - b.pid;});

    for(var i = 0; i < n; i++) {
        //console.log(proc[i].pid,proc[i].arrival_time,proc[i].burst_time,proc[i].completion_time,proc[i].turnaround_time,proc[i].waiting_time);
    }
    //console.log("Average Turnaround Time = " + avg_turnaround_time);
	//console.log("Average Waiting Time = " + avg_waiting_time);

  return[proc,total_turnaround_time,total_waiting_time,avg_turnaround_time,avg_waiting_time]
}
/****************************************************************************************************************/
function findavgTimeForPrioSchePre(pid,n,burst_time,priority,arrival_time){
    var avg_turnaround_time, avg_waiting_time;

    var total_turnaround_time = 0, total_waiting_time = 0;
    
    var burst_remaining = [], is_completed = [];

    var  start_time=[], completion_time = [], turnaround_time = [], waiting_time=[];

    var current_time = 0, completed = 0, prev = 0;

    for(var i=0;i<n;i++){
        is_completed[i]=0;
        burst_remaining[i] = burst_time[i]
    }

    while(completed != n) {
        var idx = -1;
        var mx = -1;
        for(var i = 0; i < n; i++) {
            if(arrival_time[i] <= current_time && is_completed[i] == 0) {
                if(priority[i] > mx) {
                    mx = priority[i];
                    idx = i;
                }
                if(priority[i] == mx) {
                    if(arrival_time[i] < arrival_time[idx]) {
                        mx = priority[i];
                        idx = i;
                    }
                }
            }
        }

        if(idx != -1) {
            if(burst_remaining[idx] == burst_time[idx]) {
                start_time[idx] = current_time;
            }
            burst_remaining[idx] -= 1;
            current_time++;
            prev = current_time;
            
            if(burst_remaining[idx] == 0) {
                completion_time[idx] = current_time;
                turnaround_time[idx] = completion_time[idx] - arrival_time[idx];
                waiting_time[idx] = turnaround_time[idx] - burst_time[idx];

                total_turnaround_time += turnaround_time[idx];
                total_waiting_time += waiting_time[idx];

                is_completed[idx] = 1;
                completed++;
            }
        }
        else {
             current_time++;
        }  
    }

    var min_arrival_time = 10000000;
	var max_completion_time = -1;
	
    for(var i = 0; i < n; i++) {
        min_arrival_time = Math.min(min_arrival_time,arrival_time[i]);
        max_completion_time = Math.max(max_completion_time,completion_time[i]);
    }

    avg_turnaround_time = parseFloat (total_turnaround_time) /parseFloat(n);
    avg_waiting_time = parseFloat (total_waiting_time) / parseFloat(n);

    for(var i = 0; i < n; i++) {
        //console.log(pid[i],arrival_time[i],burst_time[i],priority[i],completion_time[i],turnaround_time[i],waiting_time[i]);
    }
    //console.log("Average TAT= " + avg_turnaround_time);
    //console.log("Average Waiting Time = " + avg_waiting_time);

    return[waiting_time,turnaround_time,total_waiting_time,total_turnaround_time,avg_waiting_time,avg_turnaround_time,completion_time];

}

/****************************************************************************************************************/
function findavgTimeForPrioScheNoPre(pid,n,burst_time,priority,arrival_time){

    var start_time = [], completion_time  = [], turnaround_time = [], waiting_time = [];
    var avg_turnaround_time, avg_waiting_time;
    var total_turnaround_time = 0, total_waiting_time = 0;
    var is_completed=[];
   
    for(var i=0; i<n; i++){
        is_completed[i]=0;
    }

    var current_time = 0;
    var completed = 0;
    var prev = 0;

    while(completed != n) {
        var idx = -1;
        var mx = -1;
        for(var i = 0; i < n; i++) {
            if(arrival_time[i] <= current_time && is_completed[i] == 0) {
                if(priority[i] > mx) {
                    mx = priority[i];
                    idx = i;
                }
                if(priority[i] == mx) {
                    if(arrival_time[i] < arrival_time[idx]) {
                        mx = priority[i];
                        idx = i;
                    }
                }
            }
        }
        if(idx != -1) {
            start_time[idx] = current_time;
            completion_time[idx] = start_time[idx] + burst_time[idx];
            turnaround_time[idx] = completion_time[idx] - arrival_time[idx];
            waiting_time[idx] = turnaround_time[idx] - burst_time[idx];
            
            total_turnaround_time += turnaround_time[idx];
            total_waiting_time += waiting_time[idx];

            is_completed[idx] = 1;
            completed++;
            current_time = completion_time[idx];
            prev = current_time;
        }
        else {
            current_time++;
        }
        
    }

    var min_arrival_time = 10000000;
    var max_completion_time = -1;
    for(var i = 0; i < n; i++) {
        min_arrival_time =  Math.min(min_arrival_time,arrival_time[i]);
        max_completion_time = Math.max(max_completion_time,completion_time[i]);
    }

    avg_turnaround_time = parseFloat(total_turnaround_time)/parseFloat(n);
    avg_waiting_time = parseFloat(total_waiting_time)/parseFloat(n);

    for(var i = 0; i < n; i++) {
        //console.log(pid[i],arrival_time[i],burst_time[i],priority[i],completion_time[i],turnaround_time[i],waiting_time[i]);
    }
    //console.log("Average Turnaround Time = " + avg_turnaround_time);
	//console.log("Average Waiting Time = " + avg_waiting_time);
	
	return[waiting_time,turnaround_time,total_waiting_time,total_turnaround_time,avg_waiting_time,avg_turnaround_time,completion_time];
}
/****************************************************************************************************************/

function findavgTimeForSJF(pid,n,burst_time,arrival_time){

    var start_time = [], completion_time = [], turnaround_time = [], waiting_time = [];

    var avg_turnaround_time;
    var avg_waiting_time;
 
    var total_turnaround_time = 0;
    var total_waiting_time = 0;
   
    var is_completed = [];
    for(var i =0;i<n;i++){
        is_completed[i]=0;
    }

    var current_time = 0;
    var completed = 0;
    var prev = 0;

    while(completed != n) {
        var idx = -1;
        var mn = 10000000;
        for(var i = 0; i < n; i++) {
            if(arrival_time[i] <= current_time && is_completed[i] == 0) {
                if(burst_time[i] < mn) {
                    mn = burst_time[i];
                    idx = i;
                }
                if(burst_time[i] == mn) {
                    if(arrival_time[i] < arrival_time[idx]){
                        mn = burst_time[i];
                        idx = i;
                    }
                }
            }
        }
        if(idx != -1) {
            start_time[idx] = current_time;
            completion_time[idx] = start_time[idx] + burst_time[idx];
            turnaround_time[idx] = completion_time[idx] - arrival_time[idx];
            waiting_time[idx] = turnaround_time[idx] - burst_time[idx];
            
            total_turnaround_time += turnaround_time[idx];
            total_waiting_time += waiting_time[idx];
   

            is_completed[idx]= 1;
            completed++;
            current_time = completion_time[idx];
            prev = current_time;
        }
        else {
            current_time++;
        }
        
    }

    var min_arrival_time = 10000000;
    var max_completion_time = -1;
    for(var i = 0; i < n; i++) {
        min_arrival_time = Math.min(min_arrival_time,arrival_time[i]);
        max_completion_time = Math.max(max_completion_time,completion_time[i]);
    }

    avg_turnaround_time = parseFloat(total_turnaround_time) / parseFloat(n);
    avg_waiting_time = parseFloat(total_waiting_time) / parseFloat(n);


    for(var i = 0; i < n; i++) {
        //console.log(pid[i],arrival_time[i],burst_time[i],completion_time[i],turnaround_time[i],waiting_time[i]);
    }
    //console.log("Average TAT= " + avg_turnaround_time);
	//console.log("Average Waiting Time = " + avg_waiting_time);
	
	return[waiting_time,turnaround_time,total_waiting_time,total_turnaround_time,avg_waiting_time,avg_turnaround_time,completion_time];
}

/****************************************************************************************************************/
function findavgTimeForSRTF(pid,n,burst_time,arrival_time){

    var start_time = [], completion_time = [], turnaround_time = [], waiting_time = [];
    
    var avg_turnaround_time;
    var avg_waiting_time;
 
    var total_turnaround_time = 0;
    var total_waiting_time = 0;
   
    var burst_remaining=[];
    var is_completed = [];

    for(var i=0;i<n;i++){
        is_completed[i]=0;
        burst_remaining[i] = burst_time[i];
    }
    var current_time = 0;
    var completed = 0;
    var prev = 0;

    while(completed != n) {
        var idx = -1;
        var mn = 10000000;
        for(var i = 0; i < n; i++) {
            if(arrival_time[i] <= current_time && is_completed[i] == 0) {
                if(burst_remaining[i] < mn) {
                    mn = burst_remaining[i];
                    idx = i;
                }
                if(burst_remaining[i] == mn) {
                    if(arrival_time[i] < arrival_time[idx]) {
                        mn = burst_remaining[i];
                        idx = i;
                    }
                }
            }
        }

        if(idx != -1) {
            if(burst_remaining[idx] == burst_time[idx]) {
                start_time[idx] = current_time;
            }
            burst_remaining[idx] -= 1;
            current_time++;
            prev = current_time;
            
            if(burst_remaining[idx] == 0) {
                completion_time[idx] = current_time;
                turnaround_time[idx] = completion_time[idx] - arrival_time[idx];
                waiting_time[idx] = turnaround_time[idx] - burst_time[idx];
        
                total_turnaround_time += turnaround_time[idx];
                total_waiting_time += waiting_time[idx];

                is_completed[idx] = 1;
                completed++;
            }
        }
        else {
             current_time++;
        }  
    }

    var min_arrival_time = 10000000;
    var max_completion_time = -1;
    for(var i = 0; i < n; i++) {
        min_arrival_time = Math.min(min_arrival_time,arrival_time[i]);
        max_completion_time = Math.max(max_completion_time,completion_time[i]);
    }

    avg_turnaround_time = parseFloat(total_turnaround_time)/parseFloat(n);
    avg_waiting_time = parseFloat(total_waiting_time) / parseFloat(n);
  

    for(var i = 0; i < n; i++) {
        //console.log(pid[i],arrival_time[i],burst_time[i],completion_time[i],turnaround_time[i],waiting_time[i]);
    }
    //console.log("Average TAT= " + avg_turnaround_time);
	//console.log("Average Waiting Time = " + avg_waiting_time);

	return[waiting_time,turnaround_time,total_waiting_time,total_turnaround_time,avg_waiting_time,avg_turnaround_time,completion_time];
}

/****************************************************************************************************************/

module.exports = router;
