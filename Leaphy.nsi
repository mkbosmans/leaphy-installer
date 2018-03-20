Name "Leaphy"
OutFile "Leaphy-setup.exe"

XPStyle on
LoadLanguageFile "${NSISDIR}\Contrib\Language files\Dutch.nlf"
Icon "leaphy.ico"


; Only show installation page, no install dir has to be chosen, as that is done in the mBlock installer

Page instfiles

;--------------------------------

; The stuff to install
Section "Leaphy install"
  SectionIn RO



  Var /GLOBAL LeaphyLocalStore
  StrCpy $LeaphyLocalStore "$APPDATA\com.makeblock.Scratch3.4.11\Local Store"
  
  ; Install files in the Local Store
  SetOutPath "$LeaphyLocalStore\mBlock\libraries"
  File /r "files\LeaphyShield2"
  SetOutPath "$LeaphyLocalStore\#SharedObjects"
  File "files\makeblock.sol"



  ; Unpack the files in a temporary directory
  SetOutPath $TEMP
  SetCompress off     ; The mBlock installer is already compressed
  File "files\mBlock_win_V3.4.11.exe"
  SetCompress auto
  File "files\mBlock_win.inf"
  ExecWait '"$TEMP\mBlock_win_V3.4.11.exe" /LOADINF="$TEMP\mBlock_win.inf"'



SectionEnd

