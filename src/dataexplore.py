import pandas as pd

# data = pd.read_stata("c:/mywork/ReadyToUseInd_Final.dta", columns=['source','hhid','hvidx','hv000','hv001','hv002','hv003','hv004','hv025','hv106','hv107','hv108','hv109','hv140','hv206','hv207','hv208','hv209','hv210','hv211','hv212','hv219','hv221','hv225','hv242','hv243a','hv247','_merge'],chunksize=100000)
# df = pd.DataFrame()
# for itm in data:
#     df=df.append(itm)



data = pd.read_csv('c:/mywork/dhsreportfull.csv', low_memory=False)
data['year']=data['key'].str[-4:]



afp = pd.read_csv('c:/mywork/afp2020.csv', low_memory=False)



for i in range(1,10):
    colName = "Population_" + str(1990+i)
    afp[colName] = afp.Population_1990 + (afp.Population_2000-afp.Population_1990)/10 * i


for i in range(1,10):
    colName = "Population_" + str(2000+i)
    afp[colName] = afp.Population_2000 + (afp.Population_2010-afp.Population_2000)/10 * i


for i in range(1,5):
    colName = "Population_" + str(2010+i)
    afp[colName] = afp.Population_2010 + (afp.Population_2015-afp.Population_2010)/5 * i


for i in range(1,5):
    colName = "Population_" + str(2015+i)
    afp[colName] = afp.Population_2015 + (afp.Population_2015-afp.Population_2010)/5 * i



columnlist = ['Population_' + str(i) for i in list(range(1990,2020))]
columnlist.append('Agglomeration_ID')
afp=afp[columnlist]



melted = pd.melt(afp, id_vars="Agglomeration_ID")
melted.variable = melted.variable.str[-4:]

tomerge = melted.rename(columns={"Agglomeration_ID":"afpid","variable":"year","value":"Population"})

# data.merge(tomerge, )

datam = pd.merge(data,tomerge, on=['afpid','year'], how='left')


datam['Population'] = datam['Population'].fillna(0)
datam['category'] = pd.cut(datam.Population,bins=[-1,9999,50000,250000,1000000,999999999999999999],labels=[0,10,50,250,1000])
datam['AgeCategory'] = pd.cut(datam.agebin,bins=[-1,30,150],labels=[0,30])

datam.head()

unique_individuals = pd.pivot_table(datam, values='source' , index=['key','category','hv219','AgeCategory'],  aggfunc='count')
unique_individuals.to_csv('c:/mywork/uniqueind.csv')
unique_individuals = pd.read_csv('c:/mywork/uniqueind.csv')

unique_cities = pd.pivot_table(datam, values='afpid' , index=['key','category','hv219','AgeCategory'],  aggfunc=pd.Series.nunique)
unique_cities.to_csv('c:/mywork/temp.csv')
unique_cities = pd.read_csv('c:/mywork/temp.csv')

unique_individuals = unique_individuals.merge(unique_cities, how='left')


#'hv108' Education in single years

looplist = ['hv109','hv206','hv207','hv208','hv209','hv210','hv211','hv212','hv221','hv225','hv242','hv243a','hv247']

for x in looplist:
    temp = pd.pivot_table(datam, values='source' , index=['key','category','hv219','AgeCategory'], columns=[x], aggfunc='count')
    temp.to_csv('c:/mywork/temp.csv')
    temp = pd.read_csv('c:/mywork/temp.csv')
    temp = temp.rename(columns={"no":x+"no","yes":x+"yes"})
    unique_individuals = unique_individuals.merge(temp, how='left')


import numpy as np

x = 'hv108'
temp = pd.pivot_table(datam, values=[x] , index=['key','category','hv219','AgeCategory'],  aggfunc='mean')
temp.to_csv('c:/mywork/temp.csv')
temp = pd.read_csv('c:/mywork/temp.csv')
unique_individuals = unique_individuals.merge(temp, how='left')


unique_individuals['iso2']=unique_individuals.key.str[:2]
unique_individuals['year']=unique_individuals.key.str[2:]

unique_individuals['iso2']

isoconvert = pd.DataFrame({
    "iso2":["DZ","AO","BJ","BW","BF","BU","CM","CV","CF","TD","KM","CG","CD","CI","CI","DJ","EG","GQ","ER","ET","GA","GM","GH","GN","GW","KE","LS","LB","LY","LY","MD","MW","ML","MR","MU","MA","MZ","NM","NE","NG","RW","ST","SN","SC","SL","SO","ZA","SS","SD","SZ","TZ","TG","TN","UG","ZM","ZW"],
    "EN":["Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Cabo Verde","Central African Republic","Chad","Comoros","Republic of the Congo","Democratic Republic of the Congo","Cote d`Ivoire","Cote d`Ivoire","Djibouti","Egypt","Equatorial Guinea","Eritrea","Ethiopia","Gabon","The Gambia","Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya","Libya","Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","Sao Tome and Principe","Senegal","Seychelles","Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Kingdom of Eswatini","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe"],
    "FR":["Algérie","Angola","Bénin","Botswana","Burkina Faso","Burundi","Cameroun","Cabo Verde","République centrafricaine","Tchad","Comores","République du Congo","République démocratique du Congo","Côte d’Ivoire","Côte d’Ivoire","Djibouti","Égypte","Guinée équatoriale","Érythrée","Éthiopie","Gabon","Gambie","Ghana","Guinée","Guinée-Bissau","Kenya","Lesotho","Libéria","Libye","Libye","Madagascar","Malawi","Mali","Mauritanie","Maurice","Maroc","Mozambique","Namibie","Niger","Nigéria","Rwanda","Sao Tomé-et-Principe","Sénégal","Seychelles","Sierra Leone","Somalie","Afrique du Sud","Soudan du Sud","Soudan","Royaume d’Eswatini","Tanzanie","Togo","Tunisie","Ouganda","Zambie","Zimbabwe"]
})


unique_individuals = unique_individuals.merge(isoconvert,how='left')

unique_individuals = unique_individuals.rename(columns={"afpid":"Numberofcities","source":"NumberofInd"})


unique_individuals.to_csv('c:/mywork/result.csv',encoding='utf-8-sig')



#unique_individuals.to_csv('c:/mywork/uniqueind.csv')


pd.DataFrame(unique_individuals)


result.to_csv('c:/mywork/pivot.csv')
unique_cities.to_csv('c:/mywork/uniq.csv')




pd.crosstab(datam[['key','category']],datam['hv109'])

pd.crosstab(datam['key'],datam['hv109'])
datam['key']
datam.groupby('key').agg({'hv108':'sum'})

# out = pd.crosstab(datam['source'],datam['key'])
# out.to_csv('c:/mywork/check.csv')


# pd.crosstab(datam['key'],datam[['category','hv219']])




pd.crosstab(data['agebin'],data['hv219'])

pd.crosstab(data['hv108'],data['hv109'])

pd.value_counts(data['hv109'])




pd.set_option('display.max_rows', 200)

pd.value_counts(data['year'])

