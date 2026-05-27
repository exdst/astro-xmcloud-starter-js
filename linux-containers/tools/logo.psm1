function Show-Start {
    param (
        [Parameter()]
        [string] $Color = "Blue"
    )

    $logo = @'
'@

    write-host $logo -ForegroundColor $Color
}

function Show-Stop {
    param(
      [Parameter()]
      [string] $Color = "Yellow"
    )
  
  $logo = @'
'@
  
    Write-Host $logo -ForegroundColor Yellow
}

Export-ModuleMember -Function *