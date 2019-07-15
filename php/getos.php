/**
 * @param $user_agent null
 * @return string
 */
function getOS($user_agent = null)
{
    if(!isset($user_agent) && isset($_SERVER['HTTP_USER_AGENT'])) {
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
    }

    // https://stackoverflow.com/questions/18070154/get-operating-system-info-with-php
    $os_array = [
        'windows nt 10'                              =>  'Windows 10',
        'windows nt 6.3'                             =>  'Windows 8.1',
        'windows nt 6.2'                             =>  'Windows 8',
        'windows nt 6.1|windows nt 7.0'              =>  'Windows 7',
        'windows nt 6.0'                             =>  'Windows Vista',
        'windows nt 5.2'                             =>  'Windows Server 2003/XP x64',
        'windows nt 5.1'                             =>  'Windows XP',
        'windows xp'                                 =>  'Windows XP',
        'windows nt 5.0|windows nt5.1|windows 2000'  =>  'Windows 2000',
        'windows me'                                 =>  'Windows ME',
        'windows nt 4.0|winnt4.0'                    =>  'Windows NT',
        'windows ce'                                 =>  'Windows CE',
        'windows 98|win98'                           =>  'Windows 98',
        'windows 95|win95'                           =>  'Windows 95',
        'win16'                                      =>  'Windows 3.11',
        'mac os x 10.1[^0-9]'                        =>  'Mac OS X Puma',
        'macintosh|mac os x'                         =>  'Mac OS X',
        'mac_powerpc'                                =>  'Mac OS 9',
        'linux'                                      =>  'Linux',
        'ubuntu'                                     =>  'Linux - Ubuntu',
        'iphone'                                     =>  'iPhone',
        'ipod'                                       =>  'iPod',
        'ipad'                                       =>  'iPad',
        'android'                                    =>  'Android',
        'blackberry'                                 =>  'BlackBerry',
        'webos'                                      =>  'Mobile',

        '(media center pc).([0-9]{1,2}\.[0-9]{1,2})'=>'Windows Media Center',
        '(win)([0-9]{1,2}\.[0-9x]{1,2})'=>'Windows',
        '(win)([0-9]{2})'=>'Windows',
        '(windows)([0-9x]{2})'=>'Windows',

        // Doesn't seem like these are necessary...not totally sure though..
        //'(winnt)([0-9]{1,2}\.[0-9]{1,2}){0,1}'=>'Windows NT',
        //'(windows nt)(([0-9]{1,2}\.[0-9]{1,2}){0,1})'=>'Windows NT', // fix by bg

        'Win 9x 4.90'=>'Windows ME',
        '(windows)([0-9]{1,2}\.[0-9]{1,2})'=>'Windows',
        'win32'=>'Windows',
        '(java)([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})'=>'Java',
        '(Solaris)([0-9]{1,2}\.[0-9x]{1,2}){0,1}'=>'Solaris',
        'dos x86'=>'DOS',
        'Mac OS X'=>'Mac OS X',
        'Mac_PowerPC'=>'Macintosh PowerPC',
        '(mac|Macintosh)'=>'Mac OS',
        '(sunos)([0-9]{1,2}\.[0-9]{1,2}){0,1}'=>'SunOS',
        '(beos)([0-9]{1,2}\.[0-9]{1,2}){0,1}'=>'BeOS',
        '(risc os)([0-9]{1,2}\.[0-9]{1,2})'=>'RISC OS',
        'unix'=>'Unix',
        'os/2'=>'OS/2',
        'freebsd'=>'FreeBSD',
        'openbsd'=>'OpenBSD',
        'netbsd'=>'NetBSD',
        'irix'=>'IRIX',
        'plan9'=>'Plan9',
        'osf'=>'OSF',
        'aix'=>'AIX',
        'GNU Hurd'=>'GNU Hurd',
        '(fedora)'=>'Linux - Fedora',
        '(kubuntu)'=>'Linux - Kubuntu',
        '(ubuntu)'=>'Linux - Ubuntu',
        '(debian)'=>'Linux - Debian',
        '(CentOS)'=>'Linux - CentOS',
        '(Mandriva).([0-9]{1,3}(\.[0-9]{1,3})?(\.[0-9]{1,3})?)'=>'Linux - Mandriva',
        '(SUSE).([0-9]{1,3}(\.[0-9]{1,3})?(\.[0-9]{1,3})?)'=>'Linux - SUSE',
        '(Dropline)'=>'Linux - Slackware (Dropline GNOME)',
        '(ASPLinux)'=>'Linux - ASPLinux',
        '(Red Hat)'=>'Linux - Red Hat',
        // Loads of Linux machines will be detected as unix.
        // Actually, all of the linux machines I've checked have the 'X11' in the User Agent.
        //'X11'=>'Unix',
        '(linux)'=>'Linux',
        '(amigaos)([0-9]{1,2}\.[0-9]{1,2})'=>'AmigaOS',
        'amiga-aweb'=>'AmigaOS',
        'amiga'=>'Amiga',
        'AvantGo'=>'PalmOS',
        //'(Linux)([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,3}(rel\.[0-9]{1,2}){0,1}-([0-9]{1,2}) i([0-9]{1})86){1}'=>'Linux',
        //'(Linux)([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,3}(rel\.[0-9]{1,2}){0,1} i([0-9]{1}86)){1}'=>'Linux',
        //'(Linux)([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,3}(rel\.[0-9]{1,2}){0,1})'=>'Linux',
        '[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,3})'=>'Linux',
        '(webtv)/([0-9]{1,2}\.[0-9]{1,2})'=>'WebTV',
        'Dreamcast'=>'Dreamcast OS',
        'GetRight'=>'Windows',
        'go!zilla'=>'Windows',
        'gozilla'=>'Windows',
        'gulliver'=>'Windows',
        'ia archiver'=>'Windows',
        'NetPositive'=>'Windows',
        'mass downloader'=>'Windows',
        'microsoft'=>'Windows',
        'offline explorer'=>'Windows',
        'teleport'=>'Windows',
        'web downloader'=>'Windows',
        'webcapture'=>'Windows',
        'webcollage'=>'Windows',
        'webcopier'=>'Windows',
        'webstripper'=>'Windows',
        'webzip'=>'Windows',
        'wget'=>'Windows',
        'Java'=>'Unknown',
        'flashget'=>'Windows',

        // delete next line if the script show not the right OS
        //'(PHP)/([0-9]{1,2}.[0-9]{1,2})'=>'PHP',
        'MS FrontPage'=>'Windows',
        '(msproxy)/([0-9]{1,2}.[0-9]{1,2})'=>'Windows',
        '(msie)([0-9]{1,2}.[0-9]{1,2})'=>'Windows',
        'libwww-perl'=>'Unix',
        'UP.Browser'=>'Windows CE',
        'NetAnts'=>'Windows',
    ];

    // https://github.com/ahmad-sa3d/php-useragent/blob/master/core/user_agent.php
    $arch_regex = '/\b(x86_64|x86-64|Win64|WOW64|x64|ia64|amd64|ppc64|sparc64|IRIX64)\b/ix';
    $arch = preg_match($arch_regex, $user_agent) ? '64' : '32';

    foreach ($os_array as $regex => $value) {
        if (preg_match('{\b('.$regex.')\b}i', $user_agent)) {
            return $value.' x'.$arch;
        }
    }

    return 'Unknown';
}
