

echo Express
echo ' '
plow http://192.168.1.108:3013/api/user/hello1900 -c 100 -n 100000 -d 30s
echo Express End
echo ' '


echo tsdk Express
echo ' '
plow http://192.168.1.108:3015/api/user/hello1900 -c 100 -n 100000 -d 30s
echo tsdk Express End
echo ' '



echo Hono
echo ' '
plow http://192.168.1.108:3014/api/user/hello1900 -c 100 -n 100000 -d 30s
echo Hono End
echo ' '


echo tsdk Hono
echo ' '
plow http://192.168.1.108:3016/api/user/hello1900 -c 100 -n 100000 -d 30s
echo tsdk Hono End
echo ' '


echo Trpc Express
echo ' '
plow http://192.168.1.108:3017/api/user/hello1900 -c 100 -n 100000 -d 30s
echo Trpc Express End
echo ' '

