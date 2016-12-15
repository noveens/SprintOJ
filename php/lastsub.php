<html>
	<head>
		<title>last Submissions</title>
		<link href="../css/bootstrap.min.css" rel="stylesheet">
	    <script src="../js/html5shiv.min.js"></script>
	    <script src="../js/respond.min.js"></script>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
	    <link rel="stylesheet" type="text/css" href="../css/lastsub.css">
	</head>

	<body>
		<nav class="main-nav navbar navbar-inverse navbar-fixed-top" id ="my-navbar">
			
			<div class = "container-fluid">
			    <div class = "navbar-header">
			      	<button type="button" class ="navbar-toggle" data-toggle = "collapse" data-target ="#navbar-collapse">
				    	<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
				  	</button>
		         	<a href="../index.php" class="navbar-brand">CFToolkit</a>	
			    </div>
		       
		      	<div class="collapse navbar-collapse" id="navbar-collapse">
		         	<ul class="nav navbar-nav">
				        <li><a href="compete.php">Compete</a>
				        <li><a href='allsub.php'>All Submissions</a>
				        <li><a href="lastsub.php">Last Submissions</a>
				        <li><a href="compare.php">Compare</a>
				        <li><a href="http://www.bugecode.com/">Bug-e-Code</a>
				        <li><a href="aboutus.php">About Us</a>
					</ul>
		      	</div>
		    </div>
		</nav>



		<div class="jumbotron">

	   		<br><br><br>
	      
	      	<div class="container text-center">
	      		
	      		<div class="row" id="searchBox">
				  	<form action="lastsub.php" method="post">
						<div class="col-lg-6">
							<div class="input-group">
							    <span class="input-group-addon" id="sizing-addon1">@</span>
							    <input type="text" class="form-control" placeholder="Enter a username..." name='coder'>
							    <span class="input-group-btn">
								    <button class="btn btn-default" type="submit">Go!</button>
							    </span>
							</div><!-- /input-group -->
						</div><!-- /.col-lg-6 -->
					</form>
				</div><!-- /.row -->
			</div>
	    </div>


	    <div class="container">

			<div id="table">
					<?php
		            if(!isset($_POST['coder'])) {
		              die();
		            }
		    	?>
				
		        <?php

			        $coder=$_POST['coder'];
			        $url="http://codeforces.com/api/user.info?handles=".$coder;
		            $proxy='172.31.102.14:3128';
					$proxyauth='edcguest:edcguest';
					$ch = curl_init();
					curl_setopt($ch, CURLOPT_URL, $url);

					curl_setopt($ch,CURLOPT_PROXY,$proxy);
					curl_setopt($ch,CURLOPT_PROXYUSERPWD,$proxyauth);


					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$response = curl_exec($ch);  //getting the response from the site in JSON format
					curl_close($ch);

					$response=json_decode($response,true);
		            //values for coder
		                  
		            $response=$response['result'];
		            $response=$response[0];
		            $rating=$response['rating'];
		        ?>
		        <h3><?php echo $coder.": ".$rating; ?></h3>
			</div>
		</div>



		<div id="show_list">
      		<table class="table table-condensed">
        		<thead>
          			<tr>
            			<th><center>#</center></th>
            			<th><center>Index</center></th>
            			<th><center>Problem Name</center></th>
            			<th><center>Verdict</center></th>
          			</tr>
        		</thead>
        		
        		<tbody>
        			<?php 
					  	$coder1=$_POST['coder'];
	                  	//making http connection
	                  	$url="http://codeforces.com/api/user.status?handle=".$coder;
	                  	$proxy='172.31.102.14:3128';
						$proxyauth='edcguest:edcguest';
						$ch = curl_init();
						curl_setopt($ch, CURLOPT_URL, $url);

						curl_setopt($ch,CURLOPT_PROXY,$proxy);
						curl_setopt($ch,CURLOPT_PROXYUSERPWD,$proxyauth);


						curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
						$response = curl_exec($ch);  //getting the response from the site in JSON format
						curl_close($ch);

						$response=json_decode($response,true);
	                  	//values for coder1
	                  	if($response['status']!="OK") {
	                    	echo "Enter a Valid Username";
	                    	die();
	                  	}
	                  	
	                  	$response=$response['result'];
            
			            for($i=0; $i<15; $i++)
			            { 
			                  
			                $temp=$response[$i];
			                $contest_id=$temp['problem']['contestId'];
			                $index=$temp['problem']['index'];
			                $qname=$temp['problem']['name'];
			                $verdict=$temp['verdict'];
			                $id=$temp['id'];
			                if($verdict!="OK")
			                    $ch1="red";
			                else
			                    $ch1="green";
                  	?>

                  	<?php
                    	if($contest_id>10000) {
                        	$new_link="http://codeforces.com/gym/".$contest_id."/attachments";
                        	$new_link2="http://codeforces.com/gym/".$contest_id."/submission/".$id;
                      	}
                      	else {
                        	$new_link="http://codeforces.com/problemset/problem/".$contest_id."/".$index;
                        	$new_link2="http://codeforces.com/contest/".$contest_id."/submission/".$id;
                      	}
                  	?>
	              	<tr>
	                	<center>
	                		<td><center><?php echo $i+1; ?></center></td>
	                
	                		<td><center><font style="color : <?php echo $c1 ?>;"> <?php echo $index; ?> </font></center></td>
	                
	                		<td>
	                			<center>
	                				<font style="color : <?php echo $c1 ?>;"> 
	                  			    	<a href="<?php echo $new_link; ?>" target="_blank">
	                    					<?php echo $qname ?> 
	                    				</a>
	                  				</font>
	                  			</center>
	                  		</td>
	                
	                		<td><center>
	                			<font style="color : <?php echo $ch1 ?>;"> 
	                				<a href="<?php echo $new_link2; ?>" target="_blank">
	                				<font style="color : <?php echo $ch1 ?>;"> 
	                				<b><?php echo $verdict; ?></b> 
	                			</font>
	                		</center></td>
	                	</center>
	              	</tr>
              
        			<?php
        			    }
        			?>
      			</tbody>
          	</table>
    	</div>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	    <script src="../js/bootstrap.min.js"></script>
	    <script src="../js/main.js"></script>
	</body>
</html>