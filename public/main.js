const form = document.getElementById('vote-form');

form.addEventListener('submit', (e) => {
	const choice = document.querySelector('input[name=dslr]:checked').value;
	const data = {dslr: choice};

	fetch('http://localhost:3000/poll',{
		method:'post',
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	.then(res => res.json())
	.then(data => console.log(data))
	.catch(err => console.log(err));

	e.preventDefault();
});

fetch('http://localhost:3000/poll')
	.then(res => res.json())
	.then(data => {
		const votes = data.votes;
		const totalVotes = votes.length;

		const voteCounts = votes.reduce(
			(acc, vote) => 
				((acc[vote.dslr] = (acc[vote.dslr] || 0) + parseInt(vote.points)), acc), {});

let dataPoints = [
	{ label: 'Sony', y: voteCounts.Sony },
	{ label: 'Nikon', y: voteCounts.Nikon },
	{ label: 'Canon', y: voteCounts.Canon },
	{ label: 'Lumix', y: voteCounts.Lumix }
];

const chartContainer = document.querySelector('#chartContainer');

if(chartContainer){
	const chart = new CanvasJS.Chart('chartContainer', {
		animationEnabled: true,
		theme: 'theme1',
		title: {
			text: `Total Votes ${totalVotes}`
		},
		data: [
			{
				type: 'column',
				dataPoints: dataPoints
			}
		]
	});
	chart.render();


	 // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('9b148cf11b5ae8cc3549', {
      cluster: 'ap2',
      forceTLS: true
    });

    var channel = pusher.subscribe('dslr-poll');
    channel.bind('dslr-vote', function(data) {
      dataPoints = dataPoints.map(x => {
      	if(x.label == data.dslr){
      		x.y += data.points;
      		return x;
      	} else {
      		return x;
      	}
      });
      chart.render();
    });
}

	});


