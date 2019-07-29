namespace=CtfPerf

for filename in bin/*
do
    metricName=$(basename $filename | cut -f 1 -d '.' | sed -r 's/(^|_|-)([a-z])/\U\2/g')
    echo $(node $filename)
    aws cloudwatch put-metric-data --metric-name $metricName --namespace $namespace --value $(node $filename) --unit Milliseconds --timestamp $(date -u +"%Y-%m-%dT%H:%M:%SZ") --region us-east-1
done
