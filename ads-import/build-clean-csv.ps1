# Builds bulk-upload-clean.csv: keeps existing campaigns/ad-groups/keywords/negatives
# from bulk-upload.csv, rebuilds all RSAs (fresh high-converting copy) + assets,
# guarantees column alignment via ConvertTo-Csv. ASCII copy, <=30 headlines, <=90 desc.
$ErrorActionPreference='Stop'
$src='C:\Users\goho2\altru\altru-radiance\ads-import\bulk-upload.csv'
$out='C:\Users\goho2\altru\altru-radiance\ads-import\bulk-upload-clean.csv'
$rows=Import-Csv $src
$cols=$rows[0].PSObject.Properties.Name

function NewRow($set){
  $o=[ordered]@{}; foreach($c in $cols){ $o[$c]='' }
  foreach($k in $set.Keys){ $o[$k]=$set[$k] }
  [pscustomobject]$o
}

# KEEP: campaign settings, device-adjust, ad-group, keyword, negative rows (already aligned)
$keep = $rows | Where-Object {
  $_.'Campaign Type' -or $_.Device -or $_.Keyword -or
  ($_.'Ad Group' -and $_.'Ad Group Status' -and -not $_.'Headline 1' -and -not $_.Keyword)
}
$adgroups = $rows | Where-Object { $_.'Ad Group' -and $_.'Ad Group Status' -and -not $_.'Headline 1' -and -not $_.Keyword }

$U=@{ R='https://altruradiance.com/services/restorative-buccal-release';
     S='https://altruradiance.com/services/lymphatic-drainage-murray-utah';
     P='https://altruradiance.com/services/microneedling-murray-utah';
     B='https://altruradiance.com/' }
$PATH=@{ R=@('regenerative','facial'); S=@('lymphatic','drainage'); P=@('procell','facial'); B=@('altru','radiance') }

$H=@{}
$H.R=@('Visible Lift, No Needles','Restorative Buccal Facial','Book In Salt Lake County','Sculpt The Face, No Surgery','Fascia-Led Facial Work','Lift From The Inside Out','Master Esthetician Owned','Structure, Not Just Surface','One Session, Visible Change','No Needles. No Downtime.','Hands-First Facial Work','Buccal And Fascia Release','Where Anti-Aging Ends','Same-Week Appointments','Murray, Utah Studio')
$H.S=@('Full-Body Lymphatic Drain','Less Puffiness, More Shape','Book In Salt Lake County','Manual Lymphatic Drainage','The Day-Before Treatment','Depuff Before Any Event','No Machines, Trained Hands','Calm, Sculpted, Defined','Whole-Body Drainage Reset','Event & Photo Prep','Master Esthetician Owned','Reduce Puffiness Visibly','Same-Week Appointments','SLC Lymphatic Specialist','Murray, Utah Studio')
$H.P=@('Microchanneling, Evolved','Smaller Channels, Big Results','Book In Salt Lake County','Skin-Booster Microchanneling','Gentler Than Microneedling','No Heat. No Downtime.','Procell In Murray, Utah','Built On Skin Boosters','Visible Skin Renewal','Gentle On Sensitive Skin','Master Esthetician Owned','Smoother Tone & Texture','Same-Week Appointments','Skin-Booster Facial, SLC','Finer Channels, Less Downtime')
$H.B=@('Altru Radiance - Official','Book Direct With Altru','Murray, Utah Studio','Regenerative Facial Work','Master Esthetician Owned','Buccal, Lymphatic, Procell','No Needles. No Machines.','Visible Change, No Needles','Same-Week Appointments','Book Online In A Minute','Real Hands, Real Results',"Salt Lake's Fascia Studio",'The Official Altru Site','Premium Facial Work, SLC','Educated, Hands-First Care')

$D=@{}
$D.R=@('Visible facial lift without needles or downtime. Buccal and fascia work in Murray, Utah.','We work the structure beneath the skin, not just the surface. Book your session online.','Master Esthetician owned. The regenerative alternative to injectables. Same-week openings.','Educated, hands-first facial work in Salt Lake County. Reserve online in under a minute.')
$D.S=@('Full-body manual lymphatic drainage. Less puffiness, sharper definition, calmer tissue.','The day-before-anything treatment. Whole-body drainage by hand, no machines. Book online.','Master Esthetician owned in Murray, Utah. Reserve your Soothe session in under a minute.','Depuff and define before an event. Same-week appointments in Salt Lake County.')
$D.P=@('Procell microchanneling infuses targeted skin boosters through ultra-fine channels.','Gentler than microneedling. No heat, less downtime, visible renewal. Book online.','Master Esthetician owned in Murray, Utah. Reserve your Procell session in a minute.','Smoother tone and texture without the downtime. Same-week openings in Salt Lake.')
$D.B=@('The official Altru Radiance site. Regenerative facial work in Murray, Utah.','Master Esthetician owned. Visible change without needles or machines. Book online.','Buccal facial release, lymphatic drainage, Procell. Reserve direct in Salt Lake.','Same-week appointments. Book your session online in under a minute.')

function KeyFor($camp){ if($camp -match 'Restorative'){'R'}elseif($camp -match 'Soothe'){'S'}elseif($camp -match 'Procell'){'P'}else{'B'} }

$rsaRows=@()
foreach($ag in $adgroups){
  $k=KeyFor $ag.Campaign
  $set=[ordered]@{ 'Campaign'=$ag.Campaign; 'Ad Group'=$ag.'Ad Group'; 'Status'='Enabled'; 'Ad Type'='Responsive search ad';
    'Headline 1 position'='1';'Headline 2 position'='1';'Headline 3 position'='2';
    'Description 1'=$D[$k][0];'Description 2'=$D[$k][1];'Description 3'=$D[$k][2];'Description 4'=$D[$k][3];
    'Path 1'=$PATH[$k][0];'Path 2'=$PATH[$k][1];'Final URL'=$U[$k] }
  for($i=0;$i -lt 15;$i++){ $set["Headline $($i+1)"]=$H[$k][$i] }
  $rsaRows += (NewRow $set)
}

# Sitelinks (text<=25, desc lines<=35)
$sl=@(
 @('Restorative Buccal Facial','Buccal and fascia release','Visible lift, no needles','https://altruradiance.com/services/restorative-buccal-release'),
 @('Lymphatic Drainage','Full-body manual drainage','The day-before treatment','https://altruradiance.com/services/lymphatic-drainage-murray-utah'),
 @('Procell Microchanneling','Microchanneling, evolved','Skin boosters, less downtime','https://altruradiance.com/services/microneedling-murray-utah'),
 @('About Altru Radiance','Master Esthetician owned','Regenerative philosophy','https://altruradiance.com/about'),
 @('Book Online','Same-week availability','Reserve in under a minute','https://altruradiance.com/book'),
 @('Pricing & Services','All services and prices','Transparent, no surprises','https://altruradiance.com/services')
)
$assetRows=@()
foreach($s in $sl){ $assetRows += (NewRow ([ordered]@{ 'Asset Type'='Sitelink';'Sitelink Text'=$s[0];'Sitelink Description 1'=$s[1];'Sitelink Description 2'=$s[2];'Sitelink Final URL'=$s[3] })) }
# Callouts (<=25)
foreach($c in @('Online booking','Master Esthetician owned','Same-week availability','No needles, no machines','Murray, Utah studio','Hands-first facial work','Regenerative aesthetics')){ $assetRows += (NewRow ([ordered]@{ 'Asset Type'='Callout';'Callout Text'=$c })) }
# Structured snippet (values <=25 each)
$assetRows += (NewRow ([ordered]@{ 'Asset Type'='Structured Snippet';'Structured Snippet Header'='Services';'Structured Snippet Values'='Buccal Facial; Lymphatic Drainage; Procell Microchanneling; Facial Architecture' }))

$all = @($keep) + $rsaRows + $assetRows
$csv = $all | ConvertTo-Csv -NoTypeInformation
[System.IO.File]::WriteAllText($out, ($csv -join "`r`n"), (New-Object System.Text.UTF8Encoding($false)))
Write-Output ("wrote {0}" -f $out)
Write-Output ("  kept rows: {0} | new RSAs: {1} | asset rows: {2} | total: {3}" -f @($keep).Count,$rsaRows.Count,$assetRows.Count,$all.Count)
