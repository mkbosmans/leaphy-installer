;SetCompress off
SetCompressor /SOLID lzma
SetCompressorDictSize 80

!define MULTIUSER_EXECUTIONLEVEL Highest
!define MULTIUSER_INSTALLMODE_INSTDIR "Leaphy-mBlock"
!include "MultiUser.nsh"
!include "MUI2.nsh"

Name "Leaphy Software"
OutFile "Leaphy-setup.exe"
InstallDirRegKey HKCU "Software\Leaphy-mBlock" ""
RequestExecutionLevel user

;--------------------------------
;Variables

Var StartMenuFolder

; Only show installation page, no install dir has to be chosen, as that is done in the mBlock installer

!define MUI_ICON "logo\leaphy.ico"
!define MUI_UNICON "logo\leaphy.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "logo\leaphy-header.bmp"


!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "Dutch"

;--------------------------------

Function .onInit
  !insertmacro MULTIUSER_INIT
FunctionEnd

Function un.onInit
  !insertmacro MULTIUSER_UNINIT
FunctionEnd

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

  ; Store installation folder
  WriteRegStr HKCU "Software\Leaphy-mBlock" "" $INSTDIR

SectionEnd

