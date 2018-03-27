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
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\Leaphy-mBlock"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "Leaphy Software"
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder
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

  ; Copy all files from the default mBlock installation
  SetOutPath "$INSTDIR"
  File /r /x "unins000.*" "mBlock_win_V3.4.11-installed\*.*"

  ; Further customize the mBlock installation
  SetOutPath "$INSTDIR\ext\libraries"
  File /r "files\LeaphyShield2"

  ; Install files in the Local Store
  SetOutPath "$LeaphyLocalStore\mBlock\libraries"
  File /r "files\LeaphyShield2"
  SetOutPath "$LeaphyLocalStore\#SharedObjects"
  File "files\makeblock.sol"

  ; Store installation folder
  WriteRegStr HKCU "Software\Leaphy-mBlock" "" $INSTDIR

  ; Create start menu entries
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
  CreateShortcut "$SMPROGRAMS\$StartMenuFolder\Leaphy.lnk" "$INSTDIR\mBlock.exe"
  CreateShortcut "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  !insertmacro MUI_STARTMENU_WRITE_END

  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

SectionEnd


Section "Uninstall"

  !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuFolder
  Delete "$SMPROGRAMS\$StartMenuFolder\Leaphy.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk"
  RMDir "$SMPROGRAMS\$StartMenuFolder"

  RMDir /r "$INSTDIR\Adobe AIR"
  RMDir /r "$INSTDIR\Arduino"
  RMDir /r "$INSTDIR\assets"
  RMDir /r "$INSTDIR\drivers"
  RMDir /r "$INSTDIR\ext"
  RMDir /r "$INSTDIR\filters"
  RMDir /r "$INSTDIR\firmware"
  RMDir /r "$INSTDIR\icons"
  RMDir /r "$INSTDIR\locale"
  RMDir /r "$INSTDIR\media"
  RMDir /r "$INSTDIR\META-INF"
  RMDir /r "$INSTDIR\tools"
  Delete "$INSTDIR\mimetype"
  Delete "$INSTDIR\mBlock.*"
  Delete "$INSTDIR\*.dll"
  Delete "$INSTDIR\*.swf"

  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  DeleteRegKey /ifempty HKCU "Software\Leaphy-mBlock"

SectionEnd

