$(".subpro").click(function(){
    var no_pro = $(".procno").val();
    console.log(no_pro);
    $(".show").empty();
    $(".show").append(`<div style="margin-top:2%">
        <p style="display:inline; margin-left:5%;">SrNo/Process ID</p>
        <p style="display:inline; margin-left:17%;">Arrival Time</p>
        <p style="display:inline; margin-left:17%;">Burst Time</p>
        <p style="display:inline; margin-left:17%;">Priority</p>
    </div>`);
    for(i=0;i<Number(no_pro);i++){
        $(".show").append(`<div class="form-group data">
        <input type="number" class="form-control srno" value="${i+1}" style="width:24%; display:inline;" disabled>
        <input type="number" class="form-control arrt${i}" style="width:25%; display:inline;" min="0">
        <input type="number" class="form-control burt${i}" style="width:25%; display:inline;" min="0">
        <input type="number" class="form-control prio${i}" style="width:24%; display:inline;" min="0">
      </div>`);
    }
    $(".show").append(`<div class="form-group>
        <label for="quant">Please enter Qunatum (It will only be used in Round-Robin Scheduling)</label>
        <input type="number" class="form-control quant" id="quant">
    </div>
    <div>
        <button type="button" class="btn btn-primary mt-2 compare" style="width: 100%;">Compare</button>
    </div>`)
});

$(".show").on('click','.compare',function(){
    var proc = [];
    var n = $(".procno").val();
    console.log(n);
    for(i=0;i<n;i++){
        var x = {
            id : i+1,
            at : Number($(`.arrt${i}`).val()),
            bt : Number($(`.burt${i}`).val()),
            pr : Number($(`.prio${i}`).val()),
        }
        proc.push(x);
    }
    console.log(proc);
    var qunatum = Number($('.quant').val());
    console.log(qunatum);

    proc.push(qunatum);

    $.ajax({
        type: 'POST',
        url: '/dcatch',
        contentType: "application/json",
        data: JSON.stringify(proc),
        success: function(result){
            console.log("data sent to dash");
            $(".tabs").load('/tab')
        },
        error: function(err){
            console.log(err);
        }
    });
});