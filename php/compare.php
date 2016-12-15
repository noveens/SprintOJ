<html>
	<head>
		<title>Compare</title>
		<link href="../css/bootstrap.min.css" rel="stylesheet">
	    <script src="../js/html5shiv.min.js"></script>
	    <script src="../js/respond.min.js"></script>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
	    
	    <link rel="stylesheet" type="text/css" href="../css/compare.css">
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


		<div class="jumbotron" id="search">

	   		<br>
	      
	      	<div class="container text-center">
	      		<h1>Let the Comparison Begin!</h1>
	      		<p></p>
	      		
	      		<div class="row">
				  	<form action="compare.php" method="post">
					  	<div class="col-lg-6">
						    <div class="input-group">
						      <span class="input-group-addon" id="sizing-addon1">@</span>
						      <input type="text" class="form-control" placeholder="Search for..." name='coder1'>
						    </div><!-- /input-group -->
					  	</div><!-- /.col-lg-6 -->
						
						<div class="col-lg-6">
							<div class="input-group">
							    <span class="input-group-addon" id="sizing-addon1">@</span>
							    <input type="text" class="form-control" placeholder="Search for..." name='coder2'>
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
		            if(!isset($_POST['coder1']) ||  !isset($_POST['coder2']))
		            {
		              	die();
		            }
		    	?>

				<?php


					if(isset($_POST['coder1']) && isset($_POST['coder2'])){
						$coder1=$_POST['coder1'];
                        $coder2=$_POST['coder2'];
				    }		

					
					$url="http://codeforces.com/api/user.info?handles=".$coder1;
					$proxy='172.31.103.29:3128';
					$proxyauth='edcguest:edcguest';
					$ch = curl_init();
					curl_setopt($ch, CURLOPT_URL, $url);

					curl_setopt($ch,CURLOPT_PROXY,$proxy);
					curl_setopt($ch,CURLOPT_PROXYUSERPWD,$proxyauth);


					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$response = curl_exec($ch);  //getting the response from the site in JSON format
					curl_close($ch);

					$response=json_decode($response,true);  //converting it to PHP friendly format
					//values for coder1
					if($response['status']=="FAILED")
					{
					  echo "INVALID USERNAME1 ".$coder1;
					   die();
					}

					$response=$response['result'];
                  	$response=$response[0];
                  	$handle1=$response['handle'];
                  	$rank1=$response['rank'];
                  	$rating1=$response['rating'];
					

                    

					
					$url="http://codeforces.com/api/user.info?handles=".$coder2;
					$proxy='172.31.103.29:3128';
					$proxyauth='edcguest:edcguest';
					$ch = curl_init();
					curl_setopt($ch, CURLOPT_URL, $url);

					curl_setopt($ch,CURLOPT_PROXY,$proxy);
					curl_setopt($ch,CURLOPT_PROXYUSERPWD,$proxyauth);


					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$response = curl_exec($ch);  //getting the response from the site in JSON format
					curl_close($ch);

					$response=json_decode($response,true);  //converting it to PHP friendly format
					//values for coder1
					if($response['status']=="FAILED")
					{
					  echo "INVALID USERNAME ".$coder2;
					   die();
					}

					$response=$response['result'];
                  	$response=$response[0];
                  	$handle2=$response['handle'];
                  	$rank2=$response['rank'];
                  	$rating2=$response['rating'];	
				?>

				<?php
					echo $rank1." : ".$coder1;
					echo "<br>Rating : ".$rating1;
					echo "<br>";
					echo $rank2." : ".$coder2;
					echo "<br>Rating : ".$rating2;
					$coder1=$_POST['coder1'];
				$url="http://codeforces.com/api/user.status?handle=".$coder1;
                    $proxy='172.31.103.29:3128';
                    $proxyauth='edcguest:edcguest';
                    $ch =curl_init();
                    curl_setopt($ch,CURLOPT_URL,$url);
                   curl_setopt($ch,CURLOPT_PROXY,$proxy);
                   curl_setopt($ch,CURLOPT_PROXYUSERPWD,$proxyauth);

                    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
                    $response=curl_exec($ch);
                    curl_close($ch);
                    $response=json_decode($response,true);
                    if($response['status']!="OK")
                    {
                    	echo "Enter a valid Username";
                    	die();
                    }
                    $response=$response['result'];
                    $arr1=array();
                    $p=count($response);
                    $uc1=0;
            for($i=0; $i<$p; $i++)
            { 
                  
                  $temp=$response[$i];
                  $contest_id=$temp['problem']['contestId'];
                  $index=$temp['problem']['index'];
                  $qname=$temp['problem']['name'];
                  $verdict=$temp['verdict'];
                  $id=$temp['id'];
                  if($verdict=="OK")
                  {
                  	$uc1=$uc1+1;
                    $arr1[$contest_id.$index][0]=$contest_id;
                    $arr1[$contest_id.$index][1]=$index;
                    $arr1[$contest_id.$index][2]=$qname;
                    $arr1[$contest_id.$index][3]=1;
                    $arr1[$contest_id.$index][5]=$id;
                  }
  
            }
					 ?>
					  <?php
					  $coder2=$_POST['coder2'];
					$url="http://codeforces.com/api/user.status?handle=".$coder2;
                    $proxy='172.31.103.29:3128';
                    $pss='edcguest:edcguest';
                    $ch =curl_init();
                    curl_setopt($ch,CURLOPT_URL,$url);
                    curl_setopt($ch,CURLOPT_PROXY,$proxy);
                    curl_setopt($ch,CURLOPT_PROXYUSERPWD,$pss);

                    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
                    $response=curl_exec($ch);
                    curl_close($ch);
                    $response=json_decode($response,true);

                    if($response['status']=="FAILED")
                    {
                    	echo "INVALID Ussername ".$coder2;
         				die();
                    }
                    $uc2=0;
                    $response=$response['result'];
                    $p=count($response);
					for($i=0;$i<$p;$i++)
					{
						$temp=$response[$i];
						$contest_id=$temp['problem']['contestId'];
						$index=$temp['problem']['index'];
						$qname=$temp['problem']['name'];
						$verdict=$temp['verdict'];
						$id=$temp['id'];
						$s=0;
						if($verdict=="OK")
						{	$uc2+=1;
							$arr1[$contest_id.$index][0]=$contest_id;
							$arr1[$contest_id.$index][1]=$index;
							$arr1[$contest_id.$index][2]=$qname;
							$arr1[$contest_id.$index][4]=1;
							#	if(is_null($arr1[$contest_id.$index][3]))
							#	{$arr1[$contest_id.$index][3]=0;		
						     #       $arr1[$contest_id.$index][5]=0;
						      #  }
							$arr1[$contest_id.$index][6]=$id;
							

						}

					}
					$c1=0;$c2=0;$common=0;
					krsort($arr1);
					$i=0;
					?>
					
					<table class="table" width='70%'>
					<thead>
						<tr>
						<th><center>#</center></th>
           				<th><center>PId</center></th>
            			<th><center>Problem Name</center></th>
            			<th><center><?php echo $_POST['coder1']."'s solutions id"; ?><br>solutions</center></th>
            			<th><center><?php echo $_POST['coder2']."'s solutions id"; ?><br>solutions</center></th>
           			    </tr>
					</thead>
						<tbody>

					<?php
					foreach ($arr1 as $x=>$x_ind)
					{

						 if(isset($x_ind[3]))
						 {
						 	if(isset($x_ind[4]))
						 	{
						 		if($x_ind[3]==1 && $x_ind[4]==1)
						 		 {
						 		 	?>
						 		 	<tr>
						 		 	<center>
						 		 	<td><center><?php echo $i+1; ?></center></td>
						 		 	<td><center><?php echo $x; ?></center></td>
						 		 	<?php
						 		 	$i=$i+1;
						 		 	if($x_ind[0]>10000)
                    				{
                          			$new_link="http://codeforces.com/gym/".$x_ind[0]."/attachments";
                          			$new_link2="http://codeforces.com/gym/".$x_ind[0]."/submission/".$x_ind[5];
                          			$new_link3="http://codeforces.com/gym/".$x_ind[0]."/submission/".$x_ind[6];
                      				}
                      				else
                      				{
                          			$new_link="http://codeforces.com/problemset/problem/".$x_ind[0]."/".$x_ind[1];
                          			$new_link2="http://codeforces.com/contest/".$x_ind[0]."/submission/".$x_ind[5];
                          			$new_link3="http://codeforces.com/contest/".$x_ind[0]."/submission/".$x_ind[6];
                      				}

                					?>
						 		 	<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link;  ?>" target="_blank">
                                			<?php echo $x_ind[2] ?> 
                              		</a>
                          			</font></center>
                          			</td>
                          			<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link2;  ?>" target="_blank">
                                			<?php echo $x_ind[5] ?> 
                              		</a>
                          			</font></center>
                          			</td>
                          			<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link3;  ?>" target="_blank">
                                			<?php echo $x_ind[6] ?> 
                              		</a>
                          			</font></center>
                          			</td>
						 		 	

						 		 	</center>
						 		 	</tr>
						 		 	<?php
						 		 }
						 	}
						 }
						 

						

					}
					?>
					</tbody>

						</table>
					<table class="table" width='70%'>
					<thead>
						<tr>
						<th><center>#</center></th>
           				<th><center>PId</center></th>
            			<th><center>Problem Name</center></th>
            			<th><center><?php echo $_POST['coder1']."'s solutions id"; ?><br>solutions</center></th>
            			
           			    </tr>
					</thead>
						<tbody>

						<?php
						$i=0;
						foreach ($arr1 as $x=>$x_ind)
						{

						 if(isset($x_ind[3]))
						 {
						 	if(!isset($x_ind[4]))
						 	{
						 		if($x_ind[3]==1 )
						 		 {
						 		 	?>
						 		 	<tr>
						 		 	<center>
						 		 	<td><center><?php echo $i+1; ?></center></td>
						 		 	<td><center><?php echo $x; ?></center></td>
						 		 	<?php
						 		 	$i=$i+1;
						 		 	if($x_ind[0]>10000)
                    				{
                          			$new_link="http://codeforces.com/gym/".$x_ind[0]."/attachments";
                          			$new_link2="http://codeforces.com/gym/".$x_ind[0]."/submission/".$x_ind[5];
                          			}
                      				else
                      				{
                          			$new_link="http://codeforces.com/problemset/problem/".$x_ind[0]."/".$x_ind[1];
                          			$new_link2="http://codeforces.com/contest/".$x_ind[0]."/submission/".$x_ind[5];
                          			
                      				}

                					?>
						 		 	<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link;  ?>" target="_blank">
                                			<?php echo $x_ind[2] ?> 
                              		</a>
                          			</font></center>
                          			</td>
                          			<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link2;  ?>" target="_blank">
                                			<?php echo $x_ind[5] ?> 
                              		</a>
                          			</font></center>
                          			</td>
                        
						 		 	

						 		 	</center>
						 		 	</tr>
						 		 	<?php
						 		 }
						 	}
						 }
						}

						?>

						</tbody>

						</table>
						<table class="table" width='70%'>
					<thead>
						<tr>
						<th><center>#</center></th>
           				<th><center>PId</center></th>
            			<th><center>Problem Name</center></th>
            			<th><center><?php echo $_POST['coder2']."'s solutions id"; ?><br>solutions</center></th>
            			
           			    </tr>
					</thead>
						<tbody>

						<?php
						$i=0;
						foreach ($arr1 as $x=>$x_ind)
						{

						 if(!isset($x_ind[3]))
						 {
						 	if(isset($x_ind[4]))
						 	{
						 		if($x_ind[4]==1 )
						 		 {
						 		 	?>
						 		 	<tr>
						 		 	<center>
						 		 	<td><center><?php echo $i+1; ?></center></td>
						 		 	<td><center><?php echo $x; ?></center></td>
						 		 	<?php
						 		 	$i=$i+1;
						 		 	if($x_ind[0]>10000)
                    				{
                          			$new_link="http://codeforces.com/gym/".$x_ind[0]."/attachments";
                          			$new_link2="http://codeforces.com/gym/".$x_ind[0]."/submission/".$x_ind[6];
                          			}
                      				else
                      				{
                          			$new_link="http://codeforces.com/problemset/problem/".$x_ind[0]."/".$x_ind[1];
                          			$new_link2="http://codeforces.com/contest/".$x_ind[0]."/submission/".$x_ind[6];
                          			
                      				}

                					?>
						 		 	<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link;  ?>" target="_blank">
                                			<?php echo $x_ind[2] ?> 
                              		</a>
                          			</font></center>
                          			</td>
                          			<td><center><font style="color : blue"> 
                              		<a href="<?php echo $new_link2;  ?>" target="_blank">
                                			<?php echo $x_ind[6] ?> 
                              		</a>
                          			</font></center>
                          			</td>
                        
						 		 	

						 		 	</center>
						 		 	</tr>
						 		 	<?php
						 		 }
						 	}
						 }
						}

						?>

						</tbody>

						</table>
			</div>
		</div>



		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	    <script src="../js/bootstrap.min.js"></script>
	    <script src="../js/main.js"></script>
	</body>
</html>
