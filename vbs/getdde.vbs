Option Explicit

 'http://www.robvanderwoude.com/wshexamples.php'

Dim arrAssoc, arrKeys, arrSubKeys

Dim blnFullCmdOnly

Dim i, intValidArgs, j

Dim objDic, objReg

Dim strCommand, strDDEApp, strDDEExec, strDDETopic

Dim strFileType, strKey, strSubKey, strSubSubKey

 

Const HKCR = &H80000000

 

blnFullCmdOnly = False

intValidArgs   = 0

 

' No command line arguments required

With WScript.Arguments

	If .Unnamed.Count > 0 Then Syntax

	If .Named.Count   > 0 Then

		If .Named.Exists( "H" ) Then

			intValidArgs = intValidArgs + 1

			WScript.Echo "Extension"          & vbTab _
			           & "File Type"          & vbTab _
			           & "Shell Command"      & vbTab _
			           & "DDE Server Command" & vbTab _
			           & "DDE Application"    & vbTab _
			           & "DDE Topic"          & vbTab _
			           & "DDE Client Command"

		End If

		If .Named.Exists( "F" ) Then

			intValidArgs   = intValidArgs + 1

			blnFullCmdOnly = True

		End If

		If intValidArgs <> .Named.Count Then Syntax

	End If

End With

 

Set objReg = GetObject( "winmgmts:{impersonationLevel=impersonate}!//./root/default:StdRegProv" )

Set objDic = CreateObject( "Scripting.Dictionary" )

 

' List all keys in the HKEY_CLASSES_ROOT hive

objReg.EnumKey HKCR, "", arrKeys

 

For i = 0 To UBound( arrKeys )

	' Store registered extensions and their associated file types in a dictionary

	If Left( arrKeys(i), 1 ) = "." Then

		objReg.GetStringValue HKCR, arrKeys(i), "", strFileType

		objDic.Item( strFileType) = arrKeys(i)

	End If

	' Check if any commands are available for a file type

	strSubKey = arrKeys(i) & "\shell"

	objReg.EnumKey HKCR, strSubKey, arrSubKeys

	If IsArray( arrSubKeys ) Then

		For j = 0 To UBound( arrSubKeys )

			strSubSubKey = arrKeys(i) & "\shell\" & arrSubKeys(j) & "\ddeexec"

			objReg.GetStringValue HKCR, strSubSubKey, "", strDDEExec

			' DDE commands only

			If IsNull( strDDEExec ) Then Exit For

			strSubSubKey = arrKeys(i) & "\shell\" & arrSubKeys(j) & "\command"

			objReg.GetStringValue HKCR, strSubSubKey, "", strCommand

			strSubSubKey = arrKeys(i) & "\shell\" & arrSubKeys(j) & "\ddeexec\Application"

			objReg.GetStringValue HKCR, strSubSubKey, "", strDDEApp

			strSubSubKey = arrKeys(i) & "\shell\" & arrSubKeys(j) & "\ddeexec\Topic"

			objReg.GetStringValue HKCR, strSubSubKey, "", strDDETopic

			If blnFullCmdOnly Then

				If IsNull( strDDEApp   ) Then Exit For

				If IsNull( strDDETopic ) Then Exit For

			End If

			' Display the DDE commands

			strFileType = Split( strSubSubKey, "\" )(0)

			WScript.Echo objDic.Item( strFileType ) & vbTab _
			           & strFileType   & vbTab _
			           & arrSubKeys(j) & vbTab _
			           & strCommand    & vbTab _
			           & strDDEApp     & vbTab _
			           & strDDETopic   & vbTab _
			           & strDDEExec

		Next

	End If

	arrSubKeys = ""

Next

 

Set objDic = Nothing

Set objReg = Nothing

 

 

Sub Syntax

	WScript.Echo vbCrLf _
	           & "GetDDE.vbs,  Version 1.00" _
	           & vbCrLf _
	           & "List DDE commands for all registered file types" _
	           & vbCrLf & vbCrLf _
	           & "Usage:  CSCRIPT.EXE  //NoLogo  GETDDE.VBS  [ /F ]  [ /H ]" _
	           & vbCrLf & vbCrLf _
	           & "Where:  /F    list fully defined DDE commands only, i.e. if either the DDE" _
	           & vbCrLf _
	           & "              Application or Topic is not defined, it will not be displayed." _
	           & vbCrLf _
	           & "        /H    display a header line." _
	           & vbCrLf & vbCrLf _
	           & "Note:   Only one file extension will be listed for each registered file type." _
	           & vbCrLf & vbCrLf _
	           & "Written by Rob van der Woude" _
	           & vbCrLf _
	           & "http://www.robvanderwoude.com"

	WScript.Quit 1

End Sub