axios.get("http://localhost:3000/driver_avail")
.then(response=>{
    var table = document.getElementById("myTable");
    var row,cell;
    let size=response.length;
    var col_name=['trip_id','start_location','destination','halts','distance','travel_time','amount'];
    for(i=0;i<size;i++){
        row=table.insertRow(i+1);
        for(j=0;j<7;j++){
            cell=row.insertCell(j);
            cell.innerHTML=history[i][col_name[j]];
            console.log(history[i][col_name[j]]);
        }
    }
})